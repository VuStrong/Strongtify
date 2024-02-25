"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { CreateUpdatePlaylistRequest } from "@/types/playlist";
import ImageInput from "../inputs/ImageInput";
import { NO_IMAGE_URL } from "@/libs/constants";
import { cleanUpUrl, validateImageExtension } from "@/libs/utils";
import { createPlaylist } from "@/services/api/playlists";
import Input from "../inputs/Input";
import Button from "../buttons/Button";

export default function CreatePlaylistForm({
    onCreating,
    onCreated,
}: {
    onCreating?: () => void;
    onCreated?: () => void;
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>();

    const { data: session } = useSession();

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            status: "PUBLIC",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (isLoading) return;

        setIsLoading(true);

        if (data.image) data.image = data.image[0];

        const createTask = async () => {
            onCreating && onCreating();

            await createPlaylist(
                data as CreateUpdatePlaylistRequest,
                session?.accessToken ?? "",
            );

            // reset form
            reset();

            onCreated && onCreated();

            setIsLoading(false);
        };

        toast.promise(createTask(), {
            loading: "Đang tạo playlist...",
            success: "Đã tạo playlist mới",
            error: "Không thể tạo playlist, hãy thử lại",
        });
    };

    useEffect(() => {
        return () => {
            cleanUpUrl(imageUrl);
        };
    }, [imageUrl]);

    return (
        <form className="p-5">
            <h2 className="text-yellow-50 text-2xl font-medium mb-3">
                Tạo playlist
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
                            isLoading ? <BeatLoader color="#121212" /> : "Tạo"
                        }
                        onClick={handleSubmit(onSubmit)}
                    />
                </div>
            </div>
        </form>
    );
}
