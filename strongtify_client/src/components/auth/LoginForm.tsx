"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { AiFillGithub } from "react-icons/ai";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Button from "@/components/buttons/Button";
import Input from "@/components/inputs/Input";
import { BACKEND_URL } from "@/libs/constants";
import { SignInResponse } from "@/types/auth";
import { BeatLoader } from "react-spinners";

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);

        const res = await signIn("credentials", { ...data, redirect: false });

        if (res?.ok) {
            router.push(searchParams?.get("return") ?? "/");
            router.refresh();
        } else if (res?.error) {
            toast.error(res.error);
            setIsLoading(false);
        }
    };

    function socialLogin(provider: string) {
        window.open(
            `${BACKEND_URL}/v1/auth/${provider}`,
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
                router.push(searchParams?.get("return") ?? "/");
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
                            Đăng nhập vào Strongtify
                        </div>
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
                                "Đăng nhập"
                            )
                        }
                        onClick={handleSubmit(onSubmit)}
                    />

                    <Link href="/forgot-password" className="underline">
                        Quên mật khẩu?
                    </Link>
                </div>
                <div className="flex flex-col gap-4 mt-3">
                    <hr className="border-gray-500" />
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
                            <div>Chưa có tài khoản?</div>
                            <Link href="/register" className="underline">
                                Đăng ký
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
