"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useModal from "@/hooks/store/useModal";
import { CreateUpdatePlaylistRequest } from "@/types/playlist";
import { createPlaylist } from "@/services/api/playlists";
import { cleanUpUrl, validateImageExtension } from "@/libs/utils";
import { NO_IMAGE_URL } from "@/libs/constants";
import useRecentPlaylists from "@/hooks/store/useRecentPlaylists";
import Modal from "../Modal";
import ImageInput from "@/components/inputs/ImageInput";
import Input from "@/components/inputs/Input";

export default function CreatePlaylistModal() {
    const { data: session, status } = useSession();
    const createPlaylistModal = useModal((state) => state.createPlaylistModal);
    const fetchRecentPlaylists = useRecentPlaylists(state => state.fetchRecentPlaylists);

    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>();

    const router = useRouter();

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
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (isCreating) return;

        setIsCreating(true);

        if (data.image) data.image = data.image[0];
        data.status = data.private ? "PRIVATE" : "PUBLIC";

        const createTask = async () => {
            const res = await createPlaylist(
                data as CreateUpdatePlaylistRequest,
                session?.accessToken ?? "",
            );

            setIsCreating(false);

            onCloseModal();

            fetchRecentPlaylists();
            router.push(`/playlists/${res.id}`);
        };

        toast.promise(createTask(), {
            loading: "Đang tạo playlist...",
            success: "Đã tạo playlist mới",
            error: "Không thể tạo playlist, hãy thử lại",
        });

        onCloseModal();
    };

    useEffect(() => {
        return () => {
            cleanUpUrl(imageUrl);
        };
    }, [imageUrl]);

    const onCloseModal = () => {
        createPlaylistModal.close();

        if (isCreating) return;

        reset();
        setImageUrl(undefined);
    };

    if (status !== "authenticated" || !createPlaylistModal.isOpen) {
        return null;
    }

    return (
        <Modal
            isOpen={createPlaylistModal.isOpen}
            onClickClose={onCloseModal}
            actionButton={
                <button
                    type="button"
                    disabled={isCreating}
                    onClick={handleSubmit(onSubmit)}
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-black shadow-sm sm:ml-3 sm:w-auto"
                >
                    {isCreating ? <BeatLoader color="#121212" /> : "Tạo"}
                </button>
            }
        >
            <div className="px-4 py-3 sm:px-6">
                <h3 className="font-semibold leading-6 text-primary text-xl mb-2">
                    Tạo playlist mới
                </h3>

                <form className="p-5">
                    <div className="gap-x-4 md:flex items-stretch">
                        <div className="md:w-[150px]">
                            <ImageInput
                                id="image"
                                disabled={isCreating}
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
                                disabled={isCreating}
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
                                disabled={isCreating}
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
