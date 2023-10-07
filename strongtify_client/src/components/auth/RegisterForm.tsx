"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { AiFillGithub } from "react-icons/ai";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Button from "@/components/buttons/Button";
import Input from "@/components/inputs/Input";
import { registerUser } from "@/services/api/auth";
import { RegisterRequest, SignInResponse } from "@/types/auth";
import { BACKEND_URL } from "@/libs/constants";
import { BeatLoader } from "react-spinners";

export default function RegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            email: "",
            name: "",
            password: "",
            passwordConfirm: "",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);
        delete data.passwordConfirm;

        try {
            const registerData = await registerUser(data as RegisterRequest);

            const res = await signIn("access-token", {
                accessToken: registerData.access_token,
                refreshToken: registerData.refresh_token,
                redirect: false,
            });

            if (res?.ok) {
                router.push("/success-register");
                router.refresh();
            } else if (res?.error) {
                toast.error(res.error);
                setIsLoading(false);
            }
        } catch (error: any) {
            toast.error(error?.message);
            setIsLoading(false);
        }
    };

    function socialLogin(provider: string) {
        window.open(
            `${BACKEND_URL}/api/v1/auth/${provider}`,
            "Auth",
            "status=yes,toolbar=no,menubar=no,location=no",
        );

        const onMessage = async (e: MessageEvent<any>) => {
            if (e.origin !== BACKEND_URL) {
                return;
            }

            setIsLoading(true);

            const data: SignInResponse = JSON.parse(e.data);

            const res = await signIn("access-token", {
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                redirect: false,
            });

            window.removeEventListener("message", onMessage);

            if (res?.ok) {
                router.push("/");
                router.refresh();
            } else if (res?.error) {
                toast.error(res.error);
                setIsLoading(false);
            }
        };

        window.addEventListener("message", onMessage);
    }

    return (
        <form className="lg:h-auto md:h-auto border-0 rounded-lg shadow-lg flex flex-col w-full bg-black outline-none focus:outline-none">
            {/* BODY */}
            <div className="relative p-6 flex-auto">
                <div className="flex flex-col gap-4">
                    <div className="text-start">
                        <div className="text-xl md:text-2xl font-bold text-primary mb-2">
                            Đăng ký Strongtify
                        </div>
                    </div>
                    <Input
                        id="name"
                        label="Tên người dùng"
                        disabled={isLoading}
                        register={register("name", {
                            required: {
                                value: true,
                                message: "Tên người dùng không được để trống.",
                            },
                        })}
                        errors={errors}
                    />
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
                    <Input
                        id="password"
                        label="Mật khẩu"
                        type="password"
                        disabled={isLoading}
                        register={register("password", {
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
                        disabled={isLoading}
                        register={register("passwordConfirm", {
                            validate: (value) =>
                                value === getValues("password") ||
                                "Mật khẩu không khớp",
                        })}
                        errors={errors}
                    />
                </div>
            </div>

            {/* FOOTER */}
            <div className="flex flex-col gap-2 p-6">
                <div className="flex flex-col items-center gap-4 w-full">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        label={
                            isLoading ? (
                                <BeatLoader color="#121212" />
                            ) : (
                                "Đăng ký"
                            )
                        }
                        onClick={handleSubmit(onSubmit)}
                    />
                </div>
                <div className="flex flex-col gap-4 mt-3">
                    <hr />
                    <Button
                        disabled={isLoading}
                        outline
                        label="Đăng nhập với Google"
                        icon={FcGoogle}
                        onClick={() => {
                            socialLogin("google");
                        }}
                    />
                    <Button
                        disabled={isLoading}
                        outline
                        label="Đăng nhập với Facebook"
                        icon={FaFacebook}
                        onClick={() => {
                            socialLogin("facebook");
                        }}
                    />
                    <Button
                        disabled={isLoading}
                        outline
                        label="Đăng nhập với Github"
                        icon={AiFillGithub}
                        onClick={() => {
                            socialLogin("github");
                        }}
                    />
                    <div className="text-yellow-50 text-center mt-4 font-light">
                        <div className="flex flex-row justify-center items-center gap-2">
                            <div>Đã có tài khoản?</div>
                            <Link href="/login" className="underline">
                                Đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
