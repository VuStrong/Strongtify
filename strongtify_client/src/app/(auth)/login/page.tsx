import getUserSession from "@/services/getUserSession";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
    title: "Đăng nhập",
};

export default async function LoginPage() {
    const session = await getUserSession();

    // if user is already loged in, redirect to home page
    if (session) {
        redirect("/");
    }

    return <LoginForm />;
}
