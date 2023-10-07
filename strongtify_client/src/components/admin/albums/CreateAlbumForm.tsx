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
import AsyncSelect from "react-select/async";
import { BeatLoader } from "react-spinners";

import Input from "../../inputs/Input";
import Button from "../../buttons/Button";
import ImageInput from "../../inputs/ImageInput";
import { cleanUpUrl, validateImageExtension } from "@/libs/utils";
import { searchArtists } from "@/services/api/artists";
import { getGenres } from "@/services/api/genres";
import { CreateUpdateAlbumRequest } from "@/types/album";
import { createAlbum } from "@/services/api/albums";
import { NO_IMAGE_URL } from "@/libs/constants";

const onLoadArtists = async (inputValue: string) => {
    const artists = await searchArtists(inputValue, { skip: 0, take: 100 });

    return artists?.results ?? [];
};

const onLoadGenres = async (inputValue: string) => {
    const genres = await getGenres(inputValue);

    return genres ?? [];
};

export default function CreateAlbumForm() {
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
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);

        if (data.image) data.image = data.image[0];

        try {
            const album = await createAlbum(
                data as CreateUpdateAlbumRequest,
                session?.accessToken ?? "",
            );

            router.push("/admin/albums");
            toast.success(`${album.name} added`);
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
                        isClearable
                        cacheOptions
                        defaultOptions
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
