import Link from "next/link";
import getUserSession from "@/services/getUserSession";
import {
    getLikedAlbums,
    getLikedPlaylists,
    getLikedSongs,
} from "@/services/api/me";
import { getPlaylists } from "@/services/api/playlists";
import PlaylistSection from "@/components/playlists/PlaylistSection";
import SongSection from "@/components/songs/SongSection";
import AlbumSection from "@/components/albums/AlbumSection";
import Button from "@/components/buttons/Button";
import CreatePlaylistButton from "@/components/buttons/CreatePlaylistButton";

export default async function CollectionPage() {
    const session = await getUserSession();

    const results = await Promise.allSettled([
        getPlaylists(
            {
                skip: 0,
                take: 5,
                sort: "createdAt_desc",
                userId: session?.user.id,
            },
            session?.accessToken,
        ),
        getLikedSongs(session?.accessToken ?? "", { skip: 0, take: 8 }),
        getLikedAlbums(session?.accessToken ?? "", { skip: 0, take: 5 }),
        getLikedPlaylists(session?.accessToken ?? "", { skip: 0, take: 5 }),
    ]);

    return (
        <main>
            <h2 className="text-yellow-50 text-3xl mb-5 font-medium">
                Bộ sưu tập
            </h2>
            <div className="w-fit">
                <CreatePlaylistButton />
            </div>

            {results[0].status === "fulfilled" && (
                <div className="my-8">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-yellow-50 text-2xl font-medium">
                            Playlist
                        </h2>

                        <Link
                            href={`/users/${session?.user.id}/playlists`}
                            className="text-gray-500 hover:underline"
                        >
                            Hiện tất cả
                        </Link>
                    </div>
                    <PlaylistSection
                        playlists={(results[0] as any).value.results ?? []}
                    />
                </div>
            )}

            {results[1].status === "fulfilled" && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-yellow-50 text-2xl font-medium">
                            Bài hát đã thích
                        </h2>

                        <Link
                            href={`/collection/liked-songs`}
                            className="text-gray-500 hover:underline"
                        >
                            Hiện tất cả
                        </Link>
                    </div>

                    <SongSection
                        songs={(results[1] as any).value.results ?? []}
                    />
                </div>
            )}

            {results[2].status === "fulfilled" && (
                <div className="my-8">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-yellow-50 text-2xl font-medium">
                            Album đã thích
                        </h2>

                        <Link
                            href={`/collection/liked-albums`}
                            className="text-gray-500 hover:underline"
                        >
                            Hiện tất cả
                        </Link>
                    </div>
                    <AlbumSection
                        albums={(results[2] as any).value.results ?? []}
                    />
                </div>
            )}

            {results[3].status === "fulfilled" && (
                <div className="my-8">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-yellow-50 text-2xl font-medium">
                            Playlist đã thích
                        </h2>

                        <Link
                            href={`/collection/liked-playlists`}
                            className="text-gray-500 hover:underline"
                        >
                            Hiện tất cả
                        </Link>
                    </div>
                    <PlaylistSection
                        playlists={(results[3] as any).value.results ?? []}
                    />
                </div>
            )}
        </main>
    );
}
