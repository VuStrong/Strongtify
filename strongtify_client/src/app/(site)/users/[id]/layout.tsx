import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    return {
        title: `Strongtify - User ${params.id}`,
        openGraph: {
            title: `Strongtify - User ${params.id}`,
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
