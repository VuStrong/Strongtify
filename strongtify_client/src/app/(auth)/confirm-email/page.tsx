import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { confirmEmail } from "@/services/api/auth";
import getUserSession from "@/services/getUserSession";
import { getAccount } from "@/services/api/me";

export const metadata: Metadata = {
    title: "Xác thực Email",
};

export default async function ConfirmEmailPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | undefined };
}) {
    const session = await getUserSession();
    const account = session ? await getAccount(session.accessToken) : null;

    if (account && account.emailConfirmed) {
        redirect("/");
    }
    // if user is already loged in and not the one who need confirm email, redirect to home page
    else if (account && account.id !== searchParams?.userId) {
        redirect("/success-register");
    }

    const isSuccess =
        searchParams?.userId && searchParams?.token
            ? await confirmEmail(searchParams.userId, searchParams.token).catch(
                  () => false,
              )
            : false;

    return (
        <section className="lg:h-auto md:h-auto border-0 rounded-lg shadow-lg flex flex-col w-full bg-black outline-none focus:outline-none">
            <div className="relative p-6 flex-auto">
                <div className="flex flex-col gap-4">
                    <div className="text-center">
                        {isSuccess ? (
                            <>
                                <div className="text-xl md:text-2xl font-bold text-success mb-2">
                                    Xác thực Email thành công
                                </div>
                                <p>
                                    Bạn đã xác thực Email thành công, từ giờ bạn
                                    có thể sử dụng ứng dụng này.
                                </p>
                                <br />
                                {account ? (
                                    <a href="/" className="underline">
                                        Đi đến trang chủ
                                    </a>
                                ) : (
                                    <Link href="/login" className="underline">
                                        Đi đến trang đăng nhập
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="text-xl md:text-2xl font-bold text-error mb-2">
                                    Xác thực Email thất bại
                                </div>
                                <p>
                                    Có lỗi xảy ra trong quá trình xác thực
                                    email. Vui lòng ấn đường link dưới đây để
                                    gửi lại mã xác thực.
                                </p>
                                <br />
                                <Link
                                    href="/success-register"
                                    className="underline"
                                >
                                    Gửi lại mã xác thực
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
