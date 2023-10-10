import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: { value: string };
}): Promise<Metadata> {
    const decodedValue = decodeURIComponent(params.value);

    return {
        title: `${decodedValue} - Tìm kiếm | Strongtify`,
        description:
            "Tìm kiếm bài hát, album, nghệ sĩ và vô vàn thứ khác | Strongtify",
        openGraph: {
            title: `${decodedValue} - Tìm kiếm | Strongtify`,
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
