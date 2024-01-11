import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import getUserSession from "@/services/getUserSession";

export const metadata: Metadata = {
    title: "Quên mật khẩu",
};

export default async function ForgotPasswordPage() {
    const session = await getUserSession();

    // if user is already loged in, redirect to home page
    if (session) {
        redirect("/");
    }

    return <ForgotPasswordForm />;
}
