import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: { value: string };
}): Promise<Metadata> {
    return {
        title: `${params.value} - Tìm kiếm | Strongtify`,
        description:
            "Tìm kiếm bài hát, album, nghệ sĩ và vô vàn thứ khác | Strongtify",
        openGraph: {
            title: `${params.value} - Tìm kiếm | Strongtify`,
            description:
                "Tìm kiếm bài hát, album, nghệ sĩ và vô vàn thứ khác | Strongtify",
        }
    };
}

export default function SearchItemLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
