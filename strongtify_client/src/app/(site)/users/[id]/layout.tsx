import { getUserById } from "@/services/api/users";
import getUserSession from "@/services/getUserSession";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const session = await getUserSession();
    const user = await getUserById(params.id, undefined, session?.accessToken);

    if (!user) notFound();
    
    return {
        title: `User - ${user?.name} | Strongtify`,
        openGraph: {
            title: `User - ${user?.name} | Strongtify`,
        }
    };
}

export default function UserDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
