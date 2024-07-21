import type { Metadata } from "next";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";

export const metadata: Metadata = {
    title: "Đổi mật khẩu",
};

export default function AccountPasswordPage() {
    return (
        <section>
            <h1 className="text-3xl text-primary mb-6">Password</h1>

            <ChangePasswordForm />
        </section>
    );
}
