import { Metadata } from "next";
import SongSection from "@/components/songs/SongSection";
import AlbumSection from "@/components/albums/AlbumSection";
import PlaylistSection from "@/components/playlists/PlaylistSection";
import ArtistSection from "@/components/artists/ArtistSection";
import UserSection from "@/components/users/UserSection";
import { search } from "@/services/api/common";
import SearchForm from "@/components/SearchForm";
import GenreSection from "@/components/genres/GenreSection";
import SearchItemLinkList from "@/components/SearchItemLinkList";

export default async function SearchAllPage({
    params,
}: {
    params: { value: string };
}) {
    const decodedValue = decodeURIComponent(params.value);

    const data = await search({
        q: decodedValue,
        take: 5,
        allowCount: false,
    });

    return (
        <main>
            <SearchForm value={decodedValue} />

            <div className="flex flex-col gap-10">
                <SearchItemLinkList searchValue={decodedValue} />

                {
                    <>
                        <div>
                            <h3 className="text-yellow-50 text-2xl font-semibold mb-4">
                                Bài Hát
                            </h3>
                            <SongSection songs={data?.songs?.results ?? []} />
                        </div>

                        <div>
                            <h3 className="text-yellow-50 text-2xl font-semibold mb-4">
                                Albums
                            </h3>
                            <AlbumSection
                                albums={data?.albums?.results ?? []}
                            />
                        </div>

                        <div>
                            <h3 className="text-yellow-50 text-2xl font-semibold mb-4">
                                Playlists
                            </h3>
                            <PlaylistSection
                                playlists={data?.playlists?.results ?? []}
                            />
                        </div>

                        <div>
                            <h3 className="text-yellow-50 text-2xl font-semibold mb-4">
                                Thể Loại
                            </h3>
                            <GenreSection genres={data?.genres ?? []} />
                        </div>

                        <div>
                            <h3 className="text-yellow-50 text-2xl font-semibold mb-4">
                                Nghệ Sĩ
                            </h3>
                            <ArtistSection
                                artists={data?.artists?.results ?? []}
                            />
                        </div>

                        <div>
                            <h3 className="text-yellow-50 text-2xl font-semibold mb-4">
                                User
                            </h3>
                            <UserSection users={data?.users?.results ?? []} />
                        </div>
                    </>
                }
            </div>
        </main>
    );
}
