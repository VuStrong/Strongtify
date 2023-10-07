import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import getUserSession from "@/services/getUserSession";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Đăng ký",
};

export default async function RegisterPage() {
    const session = await getUserSession();

    // if user is already loged in, redirect to home page
    if (session?.user) {
        redirect("/");
    }

    return <RegisterForm />;
}
