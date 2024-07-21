"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CreateUpdatePlaylistRequest, PlaylistDetail } from "@/types/playlist";
import { cleanUpUrl, validateImageExtension } from "@/libs/utils";
import { NO_IMAGE_URL } from "@/libs/constants";
import Modal from "./Modal";
import ImageInput from "@/components/inputs/ImageInput";
import Input from "@/components/inputs/Input";
import { updatePlaylist } from "@/services/api/playlists";

export default function UpdatePlaylistModal({
    isOpen,
    playlist,
    onClose,
    onUpdating,
    onUpdated,
}: {
    isOpen: boolean;
    playlist: PlaylistDetail;
    onClose: () => void,
    onUpdating?: () => void;
    onUpdated?: (playlist: PlaylistDetail) => void;
}) {
    const { data: session } = useSession();

    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>(
        playlist.imageUrl,
    );

    const {
        reset,
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: playlist.name,
            description: playlist.description,
            private: playlist.status === "PRIVATE",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        if (isUpdating) return;

        setIsUpdating(true);

        if (data.image) data.image = data.image[0];
        data.status = data.private ? "PRIVATE" : "PUBLIC";

        const updateTask = async () => {
            onUpdating && onUpdating();

            const result = await updatePlaylist(
                playlist.id,
                data as CreateUpdatePlaylistRequest,
                session?.accessToken ?? "",
            );

            onUpdated?.({
                ...playlist,
                name: result.name,
                description: result.description,
                status: result.status,
                imageUrl: result.imageUrl,
            });

            setIsUpdating(false);
        };

        toast.promise(updateTask(), {
            loading: "Đang câp nhập playlist...",
            success: "Đã câp nhập playlist",
            error: "Không thể câp nhập playlist, hãy thử lại",
        });
    };

    useEffect(() => {
        return () => {
            cleanUpUrl(imageUrl);
        };
    }, [imageUrl]);

    const onCloseModal = () => {
        onClose();

        if (isUpdating) return;

        reset();
        setImageUrl(playlist.imageUrl);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClickClose={onCloseModal}
            actionButton={
                <button
                    type="button"
                    disabled={isUpdating}
                    onClick={handleSubmit(onSubmit)}
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-black shadow-sm sm:ml-3 sm:w-auto"
                >
                    {isUpdating ? <BeatLoader color="#121212" /> : "OK"}
                </button>
            }
        >
            <div className="px-4 py-3 sm:px-6">
                <h3 className="font-semibold leading-6 text-primary text-xl mb-2">
                    Chỉnh sửa playlist
                </h3>

                <form className="p-5">
                    <div className="gap-x-4 md:flex items-stretch">
                        <div className="md:w-[150px]">
                            <ImageInput
                                id="image"
                                disabled={isUpdating}
                                src={imageUrl ?? NO_IMAGE_URL}
                                width={150}
                                height={150}
                                onImageChange={(e) => {
                                    if (e.target.files) {
                                        if (
                                            !validateImageExtension(
                                                e.target.files[0],
                                            )
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
                                disabled={isUpdating}
                                register={register("name", {
                                    required: {
                                        value: true,
                                        message:
                                            "Tên playlist không được để trống.",
                                    },
                                })}
                                errors={errors}
                            />

                            <Input
                                id="description"
                                isTextArea
                                label="Miêu tả"
                                disabled={isUpdating}
                                register={register("description")}
                            />
                        </div>
                    </div>

                    <div className="flex items-center py-3 px-2">
                        <div className="flex-1">
                            <div className="text-gray-300">Riêng tư</div>
                            <div className="text-gray-500 text-sm">
                                Chỉ mình bạn có thể thấy playlist này
                            </div>
                        </div>
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                {...register("private")}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
