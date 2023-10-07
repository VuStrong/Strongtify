"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

import Input from "../../inputs/Input";
import Button from "../../buttons/Button";
import ImageInput from "../../inputs/ImageInput";
import { cleanUpUrl, validateImageExtension } from "@/libs/utils";
import { CreateUpdateGenreRequest, GenreDetail } from "@/types/genre";
import { deleteGenre, updateGenre } from "@/services/api/genres";
import { NO_IMAGE_URL } from "@/libs/constants";
import Modal from "@/components/modals/Modal";
import DeleteConfirmContent from "@/components/modals/modal-contents/DeleteConfirmContent";

export default function UpdateGenreForm({ genre }: { genre: GenreDetail }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>(
        genre.imageUrl,
    );
    const router = useRouter();

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
            name: genre.name,
            description: genre.description,
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);

        if (data.image) data.image = data.image[0];

        try {
            const updatedGenre = await updateGenre(
                genre.id,
                data as CreateUpdateGenreRequest,
                session?.accessToken ?? "",
            );

            router.push("/admin/genres");
            toast.success(`${updatedGenre.name} updated`);
        } catch (error: any) {
            toast.error(error.message);
            setIsLoading(false);
        }
    };

    const handleDelete = useCallback(async () => {
        setIsLoading(true);
        setIsModalOpen(false);

        try {
            const deletedGenre = await deleteGenre(
                genre.id,
                session?.accessToken ?? "",
            );

            router.push("/admin/genres");
            toast.success(`${deletedGenre.name} deleted`);
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
                    title="Xóa thể loại này?"
                    body="Bạn có chắc muốn xóa thể loại này không?"
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
                            message: "Tên genre không được để trống.",
                        },
                    })}
                    errors={errors}
                />

                <Input
                    id="description"
                    label="Description"
                    isTextArea
                    disabled={isLoading}
                    register={register("description")}
                />

                <div className="md:w-[350px] w-full h-fit">
                    <ImageInput
                        id="image"
                        disabled={isLoading}
                        src={imageUrl ?? NO_IMAGE_URL}
                        width={350}
                        height={350}
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
                        label={"Delete this genre"}
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                    />
                </div>
            </form>
        </>
    );
}
