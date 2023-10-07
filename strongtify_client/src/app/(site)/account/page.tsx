import type { Metadata } from "next";
import Account from "@/components/account/Account";

export const metadata: Metadata = {
    title: "Tài khoản",
};

export default function AccountPage() {
    return (
        <section>
            <h1 className="text-3xl text-primary mb-6">Account Overview</h1>

            <Account />
        </section>
    );
}
