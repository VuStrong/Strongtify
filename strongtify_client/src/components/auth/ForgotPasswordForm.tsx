"use client";

import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "../inputs/Input";
import Button from "../buttons/Button";
import { sendPasswordResetToken } from "@/services/api/auth";
import { toast } from "react-hot-toast";
import { BeatLoader } from "react-spinners";

export default function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            email: "",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);

        await sendPasswordResetToken(data.email).catch(() => undefined);

        setIsLoading(false);
        toast.success("Gửi thành công");
    };

    return (
        <form className="lg:h-auto md:h-auto border-0 rounded-lg shadow-lg flex flex-col w-full bg-black outline-none focus:outline-none">
            {/* BODY */}
            <div className="relative p-6 flex-auto">
                <div className="flex flex-col gap-4">
                    <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-primary mb-2">
                            Đặt lại mật khẩu
                        </div>
                        <p className="text-gray-300">
                            Hãy nhập địa chỉ email mà bạn đã dùng để đăng ký.
                            Chúng tôi sẽ gửi email cho bạn cùng đường liên kết
                            để đặt lại mật khẩu.
                        </p>
                    </div>
                    <Input
                        id="email"
                        label="Email"
                        disabled={isLoading}
                        register={register("email", {
                            required: {
                                value: true,
                                message: "Email không được để trống.",
                            },
                            pattern: {
                                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                message: "Email không phù hợp.",
                            },
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
                            isLoading ? <BeatLoader color="#121212" /> : "Gửi"
                        }
                        onClick={handleSubmit(onSubmit)}
                    />
                </div>
            </div>
        </form>
    );
}
