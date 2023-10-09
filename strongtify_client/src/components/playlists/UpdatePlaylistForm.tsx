"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { CreateUpdatePlaylistRequest, PlaylistDetail } from "@/types/playlist";
import ImageInput from "../inputs/ImageInput";
import { NO_IMAGE_URL } from "@/libs/constants";
import { cleanUpUrl, validateImageExtension } from "@/libs/utils";
import { updatePlaylist } from "@/services/api/playlists";
import Input from "../inputs/Input";
import Button from "../buttons/Button";

export default function UpdatePlaylistForm({
    playlist,
    onUpdated,
}: {
    playlist: PlaylistDetail;
    onUpdated?: () => void;
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>(
        playlist.imageUrl,
    );

    const { data: session } = useSession();

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: playlist.name,
            status: playlist.status,
            description: playlist.description,
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        if (isLoading) return;

        setIsLoading(true);

        if (data.image) data.image = data.image[0];

        try {
            await updatePlaylist(
                playlist.id,
                data as CreateUpdatePlaylistRequest,
                session?.accessToken ?? "",
            );

            toast.success(`Đã cập nhập thông tin playlist`);
            onUpdated && onUpdated();
        } catch (error: any) {
            toast.error(error.message);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        return () => {
            cleanUpUrl(imageUrl);
        };
    }, [imageUrl]);

    return (
        <form className="p-5">
            <h2 className="text-yellow-50 text-2xl font-medium mb-3">
                Sửa thông tin playlist
            </h2>

            <div className="gap-x-4 md:flex items-stretch">
                <div className="md:w-[150px]">
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

                <div className="flex-1 flex flex-col gap-2">
                    <Input
                        id="name"
                        label="Tên"
                        disabled={isLoading}
                        register={register("name", {
                            required: {
                                value: true,
                                message: "Tên playlist không được để trống.",
                            },
                        })}
                        errors={errors}
                    />

                    <Input
                        id="description"
                        isTextArea
                        label="Miêu tả"
                        disabled={isLoading}
                        register={register("description")}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <div className="w-full md:w-[100px]">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        label={
                            isLoading ? <BeatLoader color="#121212" /> : "Lưu"
                        }
                        onClick={handleSubmit(onSubmit)}
                    />
                </div>
            </div>
        </form>
    );
}
