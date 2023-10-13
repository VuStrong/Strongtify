"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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
import { CreateUpdateSongRequest } from "@/types/song";
import { languageOptions } from "@/libs/selectOptions";
import { cleanUpUrl, validateImageExtension } from "@/libs/utils";
import { createSong } from "@/services/api/songs";
import { getGenres } from "@/services/api/genres";
import { NO_IMAGE_URL } from "@/libs/constants";
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

export default function CreateSongForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>();
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
            name: "",
            length: 0,
            language: "NONE",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);

        if (data.image) data.image = data.image[0];

        try {
            const song = await createSong(
                data as CreateUpdateSongRequest,
                session?.accessToken ?? "",
            );

            router.push("/admin/songs");
            toast.success(`${song.name} added`);
        } catch (error: any) {
            toast.error(error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            cleanUpUrl(imageUrl);
        };
    }, [imageUrl]);

    return (
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
                                    style={{ width: "50px", height: "auto" }}
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

            <div>
                <small className="text-gray-400">
                    Note: This field can not update later
                </small>
                <Input
                    id="length"
                    label="Length"
                    type="number"
                    disabled={isLoading}
                    register={register("length", {
                        min: {
                            value: 0,
                            message: "Độ dài không được nhỏ hơn 0",
                        },
                        pattern: {
                            value: /^\d+$/,
                            message: "Độ dài phải là số nguyên",
                        },
                    })}
                    errors={errors}
                />
            </div>

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
                        value={languageOptions.find((g) => g.value === value)}
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
                            if (!validateImageExtension(e.target.files[0])) {
                                setError("image", {
                                    type: "custom",
                                    message: "Ảnh phải có định dạng .jpg, .png",
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

            <Button
                type="submit"
                disabled={isLoading}
                label={isLoading ? <BeatLoader color="#121212" /> : "Create"}
                onClick={handleSubmit(onSubmit)}
            />
        </form>
    );
}
