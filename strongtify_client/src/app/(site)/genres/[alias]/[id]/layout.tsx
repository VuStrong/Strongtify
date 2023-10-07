import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGenreById } from "@/services/api/genres";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const genre = await getGenreById(params.id);

    if (!genre) notFound();

    return {
        title: `Thể loại - ${genre.name} | Strongtify`,
        description:
            genre.description ?? `Thể loại - ${genre.name} | Strongtify`,
    };
}

export default function GenreDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
