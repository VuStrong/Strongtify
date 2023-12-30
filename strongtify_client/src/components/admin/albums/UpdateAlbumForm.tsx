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
import AsyncSelect from "react-select/async";
import { BeatLoader } from "react-spinners";

import Input from "../../inputs/Input";
import Button from "../../buttons/Button";
import ImageInput from "../../inputs/ImageInput";
import { cleanUpUrl, validateImageExtension } from "@/libs/utils";
import { getGenres } from "@/services/api/genres";
import { AlbumDetail, CreateUpdateAlbumRequest } from "@/types/album";
import { deleteAlbum, updateAlbum } from "@/services/api/albums";
import { NO_IMAGE_URL } from "@/libs/constants";
import Modal from "@/components/modals/Modal";
import DeleteConfirmContent from "@/components/modals/modal-contents/DeleteConfirmContent";
import { getArtists } from "@/services/api/artists";

const onLoadArtists = async (inputValue: string) => {
    const artists = await getArtists({ 
        skip: 0, 
        take: 100, 
        q: inputValue,
        sort: "followerCount_desc"
    });

    return artists?.results ?? [];
};

const onLoadGenres = async (inputValue: string) => {
    const genres = await getGenres({ skip: 0, take: 100, q: inputValue});

    return genres?.results ?? [];
};

export default function UpdateAlbumForm({ album }: { album: AlbumDetail }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>(
        album.imageUrl,
    );
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
            name: album.name,
            artistId: album.artist?.id,
            genreIds: album.genres?.map((g) => g.id),
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);

        if (data.image) data.image = data.image[0];

        try {
            const updatedAlbum = await updateAlbum(
                album.id,
                data as CreateUpdateAlbumRequest,
                session?.accessToken ?? "",
            );

            router.push("/admin/albums");
            toast.success(`${updatedAlbum.name} updated`);
        } catch (error: any) {
            toast.error(error.message);
            setIsLoading(false);
        }
    };

    const handleDelete = useCallback(async () => {
        setIsLoading(true);
        setIsDeleteModalOpen(false);

        try {
            const deletedAlbum = await deleteAlbum(
                album.id,
                session?.accessToken ?? "",
            );

            router.push("/admin/albums");
            toast.success(`${deletedAlbum.name} deleted`);
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
                isOpen={isDeleteModalOpen}
                onClickClose={() => {
                    setIsDeleteModalOpen(false);
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
                    title="Xóa album này?"
                    body="Bạn có chắc muốn xóa album này không? (hãy xóa hết các bài hát trong album trước khi xóa album này)"
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
                            message: "Tên album không được để trống.",
                        },
                    })}
                    errors={errors}
                />

                <Controller
                    control={control}
                    name="artistId"
                    render={({ field: { onChange } }) => (
                        <AsyncSelect
                            id="artistId"
                            placeholder="Select artist"
                            cacheOptions
                            defaultValue={album.artist}
                            defaultOptions
                            isClearable
                            loadOptions={onLoadArtists}
                            getOptionValue={(option) => `${option["id"]}`}
                            isDisabled={isLoading}
                            onChange={(data) => {
                                onChange(data?.id);
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
                                    <div className="text-black">{option.name}</div>
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
                            defaultValue={album.genres}
                            defaultOptions
                            loadOptions={onLoadGenres}
                            isMulti
                            getOptionValue={(option) => `${option["id"]}`}
                            isDisabled={isLoading}
                            onChange={(data) => {
                                onChange(data?.map((a) => a.id));
                            }}
                            formatOptionLabel={(option: any) => (
                                <div className="text-black">{option.name}</div>
                            )}
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
                        label={"Delete this album"}
                        onClick={() => {
                            setIsDeleteModalOpen(true);
                        }}
                    />
                </div>
            </form>
        </>
    );
}
