"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

import Input from "../../inputs/Input";
import Button from "../../buttons/Button";
import ImageInput from "../../inputs/ImageInput";
import { cleanUpUrl, validateImageExtension } from "@/libs/utils";
import { createArtist } from "@/services/api/artists";
import { CreateUpdateArtistRequest } from "@/types/artist";
import { DEFAULT_AVATAR_URL } from "@/libs/constants";

export default function CreateArtistForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>();
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
            name: "",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);

        if (data.image) data.image = data.image[0];

        try {
            const artist = await createArtist(
                data as CreateUpdateArtistRequest,
                session?.accessToken ?? "",
            );

            router.push("/admin/artists");
            toast.success(`${artist.name} added`);
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
                        message: "Tên artist không được để trống.",
                    },
                })}
                errors={errors}
            />

            <Input
                id="birthDate"
                label="Birth Date"
                disabled={isLoading}
                register={register("birthDate")}
                type="date"
            />

            <Input
                id="about"
                label="About"
                isTextArea
                disabled={isLoading}
                register={register("about")}
            />

            <div className="w-[150px] h-fit">
                <ImageInput
                    id="image"
                    disabled={isLoading}
                    src={imageUrl ?? DEFAULT_AVATAR_URL}
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
