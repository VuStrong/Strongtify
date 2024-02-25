import SearchForm from "@/components/SearchForm";
import SearchItemLinkList from "@/components/SearchItemLinkList";
import { getGenres } from "@/services/api/genres";
import GenreSection from "@/components/genres/GenreSection";

export default async function SearchGenrePage({
    params,
}: {
    params: { value: string };
}) {
    const genres = await getGenres({
        skip: 0,
        take: 100,
        q: decodeURIComponent(params.value),
    });

    return (
        <main>
            <SearchForm
                value={decodeURIComponent(params.value)}
                searchItem="genres"
            />

            <div className="flex flex-col gap-10">
                <SearchItemLinkList
                    activeLink="genres"
                    searchValue={decodeURIComponent(params.value)}
                />

                <GenreSection genres={genres?.results ?? []} />
            </div>
        </main>
    );
}
