"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { BeatLoader } from "react-spinners";

import Input from "../inputs/Input";
import Button from "../buttons/Button";
import { resetPassword } from "@/services/api/auth";

export default function ResetPasswordForm({
    userId,
    token,
}: {
    userId: string;
    token: string;
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            newPassword: "",
            newPasswordConfirm: "",
            userId,
            token,
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);

        try {
            await resetPassword({
                userId: data.userId,
                token: data.token,
                newPassword: data.newPassword,
            });

            toast.success("Đặt lại mật khẩu thành công.");
            router.push("/login");
        } catch (error) {
            toast.error("Không thể đặt lại mật khẩu.");
            setIsLoading(false);
        }
    };

    return (
        <form className="lg:h-auto md:h-auto border-0 rounded-lg shadow-lg flex flex-col w-full bg-black outline-none focus:outline-none">
            {/* BODY */}
            <div className="relative p-6 flex-auto">
                <div className="flex flex-col gap-4">
                    <div className="text-start">
                        <div className="text-xl md:text-2xl font-bold text-primary mb-2">
                            Đặt lại mật khẩu
                        </div>
                    </div>
                    <input type="hidden" name="userId" />
                    <input type="hidden" name="token" />
                    <Input
                        id="newPassword"
                        label="Mật khẩu mới"
                        type="password"
                        disabled={isLoading}
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
                        id="newPasswordConfirm"
                        label="Nhập lại mật khẩu"
                        type="password"
                        disabled={isLoading}
                        register={register("newPasswordConfirm", {
                            validate: (value) =>
                                value === getValues("newPassword") ||
                                "Mật khẩu không khớp",
                        })}
                        errors={errors}
                    />
                </div>
            </div>

            {/* FOOTER */}
            <div className="flex flex-col p-6">
                <div className="flex flex-col items-center w-full">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        label={
                            isLoading ? (
                                <BeatLoader color="#121212" />
                            ) : (
                                "Xác nhận"
                            )
                        }
                        onClick={handleSubmit(onSubmit)}
                    />
                </div>
            </div>
        </form>
    );
}
