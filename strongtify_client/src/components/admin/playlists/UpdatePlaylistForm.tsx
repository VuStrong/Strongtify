'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Controller, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import Select from "react-select";

import Button from "@/components/buttons/Button";
import ImageInput from "@/components/inputs/ImageInput";
import Input from "@/components/inputs/Input";
import Modal from "@/components/modals/Modal";
import DeleteConfirmContent from "@/components/modals/modal-contents/DeleteConfirmContent";
import { NO_IMAGE_URL } from "@/libs/constants";
import { cleanUpUrl, validateImageExtension } from "@/libs/utils";
import { CreateUpdatePlaylistRequest, PlaylistDetail } from "@/types/playlist"
import { deletePlaylist, updatePlaylist } from "@/services/api/playlists";

const statusOptions: {
    value: "PUBLIC" | "PRIVATE";
    label: string;
}[] = [
    { value: "PUBLIC", label: "Public" },
    { value: "PRIVATE", label: "Private" },
];

export default function UpdatePlaylistForm({
    playlist
}: {
    playlist: PlaylistDetail
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>(
        playlist.imageUrl,
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
            name: playlist.name,
            description: playlist.description,
            status: playlist.status
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);

        if (data.image) data.image = data.image[0];

        try {
            const updatedPlaylist = await updatePlaylist(
                playlist.id,
                data as CreateUpdatePlaylistRequest,
                session?.accessToken ?? "",
            );

            toast.success(`${updatedPlaylist.name} updated`);
        } catch (error: any) {
            toast.error(error.message);
        }

        setIsLoading(false);
    };

    const handleDelete = useCallback(async () => {
        setIsLoading(true);
        setIsDeleteModalOpen(false);

        try {
            const deletedPlaylist = await deletePlaylist(
                playlist.id,
                session?.accessToken ?? "",
            );

            router.push("/admin/playlists");
            toast.success(`${deletedPlaylist.name} deleted`);
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
                    title="Xóa playlist này?"
                    body="Bạn có chắc muốn xóa playlist này không? (chỉ xóa playlist của user nếu nó vi phạm)"
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
                            message: "Tên playlist không được để trống.",
                        },
                    })}
                    errors={errors}
                />

                <Input
                    id="description"
                    label="Description"
                    disabled={isLoading}
                    register={register("description")}
                />

                <Controller
                    control={control}
                    name="status"
                    render={({ field: { onChange, value } }) => (
                        <Select
                            placeholder="Select status"
                            options={statusOptions}
                            isDisabled={isLoading}
                            value={statusOptions.find((g) => g.value === value)}
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
                        label={"Delete this playlist"}
                        onClick={() => {
                            setIsDeleteModalOpen(true);
                        }}
                    />
                </div>
            </form>
        </>
    );
}