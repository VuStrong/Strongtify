import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import getUserSession from "@/services/getUserSession";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Đặt lại mật khẩu",
};

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | undefined };
}) {
    const session = await getUserSession();

    // if user is already loged in, redirect to home page
    if (session) {
        redirect("/");
    }

    return (
        <ResetPasswordForm
            userId={searchParams?.userId ?? ""}
            token={searchParams?.token ?? ""}
        />
    );
}
