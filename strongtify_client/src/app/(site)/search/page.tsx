import type { Metadata } from "next";
import { getGenres } from "@/services/api/genres";
import SearchForm from "@/components/SearchForm";
import GenreSection from "@/components/genres/GenreSection";

export const metadata: Metadata = {
    title: "Strongtify - Tìm kiếm",
    description:
        "Tìm kiếm bài hát, album, nghệ sĩ và vô vàn thứ khác | Strongtify",
    openGraph: {
        title: "Strongtify - Tìm kiếm",
        description:
            "Tìm kiếm bài hát, album, nghệ sĩ và vô vàn thứ khác | Strongtify",
    }
};

export default async function SearchPage() {
    const genres = await getGenres({
        skip: 0, take: 100
    });

    return (
        <main className="py-5">
            <SearchForm />

            <h3 className="text-yellow-50 text-2xl font-semibold mb-4">
                Chủ đề và thể loại
            </h3>

            <GenreSection genres={genres?.results ?? []} />
        </main>
    );
}
