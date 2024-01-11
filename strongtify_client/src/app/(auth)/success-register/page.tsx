import type { Metadata } from "next";
import { redirect } from "next/navigation";
import getUserSession from "@/services/getUserSession";
import SendEmailConfirmationButton from "@/components/buttons/SendEmailConfirmationButton";
import { getAccount } from "@/services/api/me";
import SignOutButton from "@/components/buttons/SignOutButton";

export const metadata: Metadata = {
    title: "Đăng ký thành công",
};

export default async function SuccessRegisterPage() {
    const session = await getUserSession();
    const account = session ? await getAccount(session.accessToken) : null;

    if (account?.emailConfirmed) {
        redirect("/");
    }

    return (
        <section className="lg:h-auto md:h-auto border-0 rounded-lg shadow-lg flex flex-col w-full bg-black outline-none focus:outline-none">
            <div className="relative p-6 flex-auto">
                <div className="flex flex-col gap-4">
                    <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-success mb-2">
                            Đăng ký tài khoản thành công
                        </div>
                        <p>
                            Chúng tôi đã gửi cho bạn một email để xác thực tài
                            khoản, hãy kiểm tra hòm thư.
                        </p>
                        <br />
                        <div className="mb-3">
                            Không nhận được email?
                            <SendEmailConfirmationButton
                                accessToken={session?.accessToken ?? ""}
                            />
                        </div>
                        <SignOutButton accessToken={session?.accessToken ?? ""} refreshToken={session?.refreshToken ?? ""} />
                    </div>
                </div>
            </div>
        </section>
    );
}
