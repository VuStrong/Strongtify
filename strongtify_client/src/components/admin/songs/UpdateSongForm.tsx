"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import {
    Controller,
    FieldValues,
    SubmitHandler,
    useForm,
} from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { BeatLoader } from "react-spinners";

import Input from "../../inputs/Input";
import Button from "../../buttons/Button";
import ImageInput from "../../inputs/ImageInput";
import { CreateUpdateSongRequest, SongDetail } from "@/types/song";
import { languageOptions } from "@/libs/selectOptions";
import { cleanUpUrl, validateImageExtension } from "@/libs/utils";
import { deleteSong, updateSong } from "@/services/api/songs";
import { searchArtists } from "@/services/api/artists";
import { getGenres } from "@/services/api/genres";
import { NO_IMAGE_URL } from "@/libs/constants";
import Modal from "@/components/modals/Modal";
import DeleteConfirmContent from "@/components/modals/modal-contents/DeleteConfirmContent";

const onLoadArtists = async (inputValue: string) => {
    const artists = await searchArtists(inputValue, { skip: 0, take: 100 });

    return artists?.results ?? [];
};

const onLoadGenres = async (inputValue: string) => {
    const genres = await getGenres(inputValue);

    return genres ?? [];
};

export default function UpdateSongForm({ song }: { song: SongDetail }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>(song.imageUrl);
    const router = useRouter();

    const { data: session } = useSession();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: song.name,
            language: song.language ?? "NONE",
            releasedAt: song.releasedAt?.split("T")[0],
            songUrl: song.songUrl,
            artistIds: song.artists?.map((a) => a.id),
            genreIds: song.genres?.map((g) => g.id),
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);

        if (data.image) data.image = data.image[0];

        try {
            const updatedSong = await updateSong(
                song.id,
                data as CreateUpdateSongRequest,
                session?.accessToken ?? "",
            );

            router.push("/admin/songs");
            toast.success(`${updatedSong.name} updated`);
        } catch (error: any) {
            toast.error(error.message);
            setIsLoading(false);
        }
    };

    const handleDelete = useCallback(async () => {
        setIsLoading(true);
        setIsModalOpen(false);

        try {
            const deletedSong = await deleteSong(
                song.id,
                session?.accessToken ?? "",
            );

            router.push("/admin/songs");
            toast.success(`${deletedSong.name} deleted`);
        } catch (error: any) {
            toast.error(error.message);
            setIsLoading(false);
        }
    }, [session]);

    useEffect(() => {
        return () => {
            cleanUpUrl(imageUrl);
        };
    }, [imageUrl]);

    return (
        <>
            <Modal
                isOpen={isModalOpen}
                onClickClose={() => {
                    setIsModalOpen(false);
                }}
                actionButton={
                    <button
                        onClick={handleDelete}
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-error px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    >
                        Xóa
                    </button>
                }
            >
                <DeleteConfirmContent
                    title="Xóa bài hát này?"
                    body="Bạn có chắc muốn xóa bài hát này không?"
                />
            </Modal>

            <form className="flex flex-col gap-3">
                <Input
                    id="name"
                    label="Name"
                    disabled={isLoading}
                    register={register("name", {
                        required: {
                            value: true,
                            message: "Tên bài hát không được để trống.",
                        },
                    })}
                    errors={errors}
                />

                <Controller
                    control={control}
                    name="artistIds"
                    render={({ field: { onChange } }) => (
                        <AsyncSelect
                            id="artistIds"
                            placeholder="Select artists"
                            cacheOptions
                            defaultValue={song.artists}
                            defaultOptions
                            loadOptions={onLoadArtists}
                            isMulti
                            getOptionValue={(option) => `${option["id"]}`}
                            isDisabled={isLoading}
                            onChange={(data) => {
                                onChange(data?.map((a) => a.id));
                            }}
                            formatOptionLabel={(option: any) => (
                                <div className="flex flex-row items-center gap-3">
                                    <Image
                                        src={
                                            option.imageUrl ??
                                            "/img/default-avatar.jpg"
                                        }
                                        style={{
                                            width: "50px",
                                            height: "auto",
                                        }}
                                        width={50}
                                        height={50}
                                        alt={option.name}
                                    />
                                    <div>{option.name}</div>
                                </div>
                            )}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="genreIds"
                    render={({ field: { onChange } }) => (
                        <AsyncSelect
                            id="genreIds"
                            placeholder="Select genres"
                            cacheOptions
                            defaultValue={song.genres}
                            defaultOptions
                            loadOptions={onLoadGenres}
                            isMulti
                            getOptionValue={(option) => `${option["id"]}`}
                            isDisabled={isLoading}
                            onChange={(data) => {
                                onChange(data?.map((a) => a.id));
                            }}
                            formatOptionLabel={(option: any) => (
                                <div>{option.name}</div>
                            )}
                        />
                    )}
                />

                <Input
                    id=""
                    label="Length"
                    type="number"
                    disabled={true}
                    value={song.length.toString()}
                />

                <Input
                    id="releasedAt"
                    label="Released At"
                    disabled={isLoading}
                    register={register("releasedAt")}
                    type="date"
                />

                <div>
                    <small className="text-gray-400">
                        Link: https://docs.google.com/uc?export=open&id=:id
                    </small>
                    <Input
                        id="songUrl"
                        label="Song URL"
                        disabled={isLoading}
                        register={register("songUrl")}
                    />
                </div>

                <Controller
                    control={control}
                    name="language"
                    render={({ field: { onChange, value } }) => (
                        <Select
                            id="language"
                            options={languageOptions}
                            isDisabled={isLoading}
                            value={languageOptions.find(
                                (g) => g.value === value,
                            )}
                            onChange={(data) => {
                                onChange(data?.value);
                            }}
                        />
                    )}
                />

                <div className="w-[150px] h-fit">
                    <ImageInput
                        id="image"
                        disabled={isLoading}
                        src={imageUrl ?? NO_IMAGE_URL}
                        width={150}
                        height={150}
                        onImageChange={(e) => {
                            if (e.target.files) {
                                if (
                                    !validateImageExtension(e.target.files[0])
                                ) {
                                    setError("image", {
                                        type: "custom",
                                        message:
                                            "Ảnh phải có định dạng .jpg, .png",
                                    });
                                    return;
                                }

                                clearErrors("image");

                                setValue("image", e.target.files);

                                cleanUpUrl(imageUrl);

                                const tempUrl = URL.createObjectURL(
                                    e.target.files[0],
                                );
                                setImageUrl(tempUrl);
                            }
                        }}
                        errors={errors}
                    />
                </div>

                <div className="flex gap-x-3">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        label={
                            isLoading ? (
                                <BeatLoader color="#121212" />
                            ) : (
                                "Update"
                            )
                        }
                        onClick={handleSubmit(onSubmit)}
                    />

                    <Button
                        type="button"
                        bgType="error"
                        disabled={isLoading}
                        label={"Delete this song"}
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                    />
                </div>
            </form>
        </>
    );
}
