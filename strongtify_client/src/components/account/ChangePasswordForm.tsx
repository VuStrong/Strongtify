"use client";

import { changePassword } from "@/services/api/me";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "../buttons/Button";
import Input from "../inputs/Input";

export default function ChangePasswordForm() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        getValues,
        reset,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setLoading(true);

        try {
            await changePassword(
                data.oldPassword,
                data.newPassword,
                session?.accessToken ?? "",
            );
            toast.success("Đổi mật khẩu thành công");
            reset();
        } catch (error: any) {
            toast.error(error.message);
        }

        setLoading(false);
    };

    return (
        <form className="flex flex-col gap-5">
            <Input
                id="oldPassword"
                label="Mật khẩu cũ"
                type="password"
                disabled={loading}
                register={register("oldPassword", {
                    required: {
                        value: true,
                        message: "Mật khẩu không được để trống.",
                    },
                })}
                errors={errors}
            />
            <Input
                id="newPassword"
                label="Mật khẩu mới"
                type="password"
                disabled={loading}
                register={register("newPassword", {
                    required: {
                        value: true,
                        message: "Mật khẩu không được để trống.",
                    },
                    minLength: {
                        value: 6,
                        message: "Mật khẩu phải có tối thiểu 6 kí tự.",
                    },
                })}
                errors={errors}
            />
            <Input
                id="passwordConfirm"
                label="Nhập lại mật khẩu"
                type="password"
                disabled={loading}
                register={register("passwordConfirm", {
                    validate: (value) =>
                        value === getValues("newPassword") ||
                        "Mật khẩu không khớp",
                })}
                errors={errors}
            />

            <hr />

            <div className="md:w-[100px]">
                <Button
                    type="submit"
                    disabled={loading}
                    label="Change"
                    onClick={handleSubmit(onSubmit)}
                />
            </div>
        </form>
    );
}
