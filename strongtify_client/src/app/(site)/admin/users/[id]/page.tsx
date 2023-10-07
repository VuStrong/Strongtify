import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAccountById } from "@/services/api/accounts";
import getUserSession from "@/services/getUserSession";
import Account from "@/components/admin/accounts/Account";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    return {
        title: `Edit ${params.id}`,
    };
}

export default async function AdminUserDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await getUserSession();
    const user = await getAccountById(params.id, session?.accessToken ?? "");

    if (!user) {
        notFound();
    }

    return (
        <section className="mb-5">
            <h1 className="text-primary text-4xl mb-7">User {user?.name}</h1>

            <Account account={user} />
        </section>
    );
}
