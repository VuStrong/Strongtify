"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import {
    Controller,
    FieldValues,
    SubmitHandler,
    useForm,
} from "react-hook-form";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import { BeatLoader } from "react-spinners";

import { getAccount, updateAccount } from "@/services/api/me";
import Input from "../inputs/Input";
import Button from "../buttons/Button";
import ImageInput from "../inputs/ImageInput";
import { genderOptions } from "@/libs/selectOptions";
import { cleanUpUrl, validateImageExtension } from "@/libs/utils";
import { DEFAULT_AVATAR_URL } from "@/libs/constants";

export default function UpdateAccountForm() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState<boolean>(true);
    const [editting, setEditting] = useState<boolean>(false);
    const [email, setEmail] = useState<string>();
    const [imageUrl, setImageUrl] = useState<string>();

    useEffect(() => {
        const getUser = async () => {
            const user = await getAccount(session?.accessToken ?? "");

            if (user) {
                cleanUpUrl(imageUrl);

                setEmail(user.email);
                setImageUrl(user.imageUrl);
                setValue("name", user.name);
                setValue("about", user.about ?? "");
                setValue("gender", user.gender);
                setValue("birthDate", user.birthDate?.split("T")[0]);
            }

            setLoading(false);
        };

        if (session?.accessToken) getUser();

        return () => {
            cleanUpUrl(imageUrl);
        };
    }, [session]);

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        control,
        formState: { errors },
    } = useForm<FieldValues>();

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setEditting(true);

        if (data.image) data.image = data.image[0];

        try {
            await updateAccount(data, session?.accessToken ?? "");

            update({});

            toast.success("Cập nhập thành công");
        } catch (error: any) {
            toast.error(error.message);
        }

        setEditting(false);
    };

    return (
        <form className="flex flex-col gap-5 pb-5">
            <div className="w-[150px] h-fit">
                {loading ? (
                    <Skeleton
                        width={150}
                        height={150}
                        highlightColor="#f58c1b"
                    />
                ) : (
                    <ImageInput
                        id="image"
                        disabled={editting}
                        src={imageUrl ?? DEFAULT_AVATAR_URL}
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
                )}
            </div>

            {loading ? (
                <Skeleton highlightColor="#f58c1b" />
            ) : (
                <Input
                    id="name"
                    label="Tên người dùng"
                    disabled={editting}
                    register={register("name", {
                        required: {
                            value: true,
                            message: "Tên người dùng không được để trống.",
                        },
                    })}
                    errors={errors}
                />
            )}

            <hr />

            {loading ? (
                <Skeleton highlightColor="#f58c1b" />
            ) : (
                <Input id="email" label="Email" value={email} disabled={true} />
            )}

            <hr />

            {loading ? (
                <Skeleton highlightColor="#f58c1b" />
            ) : (
                <Controller
                    control={control}
                    name="gender"
                    render={({ field: { onChange, value } }) => (
                        <Select
                            placeholder="Select gender"
                            options={genderOptions}
                            isDisabled={editting}
                            value={genderOptions.find((g) => g.value === value)}
                            onChange={(data) => {
                                onChange(data?.value);
                            }}
                            formatOptionLabel={(option: any) => (
                                <div className="text-black">{option.label}</div>
                            )}
                        />
                    )}
                />
            )}

            {loading ? (
                <Skeleton highlightColor="#f58c1b" />
            ) : (
                <Input
                    id="birthDate"
                    label="Ngày sinh"
                    disabled={editting}
                    register={register("birthDate")}
                    type="date"
                />
            )}

            {loading ? (
                <Skeleton highlightColor="#f58c1b" />
            ) : (
                <Input
                    id="about"
                    label="About me"
                    disabled={editting}
                    register={register("about")}
                />
            )}

            <div className="md:w-[100px]">
                <Button
                    type="submit"
                    disabled={editting || loading}
                    label={
                        editting ? <BeatLoader color="#121212" /> : "Chỉnh sửa"
                    }
                    onClick={handleSubmit(onSubmit)}
                />
            </div>
        </form>
    );
}
