import type { Metadata } from "next";
import { redirect } from "next/navigation";
import getUserSession from "@/services/getUserSession";
import SendEmailConfirmationButton from "@/components/buttons/SendEmailConfirmationButton";
import { getAccount } from "@/services/api/me";
import ReSignInHandler from "@/handlers/ReSignInHandler";

export const metadata: Metadata = {
    title: "Đăng ký thành công",
};

export default async function SuccessRegisterPage() {
    const session = await getUserSession();

    const user = await getAccount(session?.accessToken ?? "").catch(
        () => undefined,
    );

    if (user?.emailConfirmed) {
        if (session?.user.emailConfirmed) {
            redirect("/");
        }

        return (
            <ReSignInHandler
                userId={session?.user.id ?? ""}
                refreshToken={session?.refreshToken ?? ""}
                redirectAfterUpdate={true}
            />
        );
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
                        <div>
                            Không nhận được email?
                            <SendEmailConfirmationButton
                                accessToken={session?.accessToken ?? ""}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
