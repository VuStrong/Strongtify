import Link from "next/link";
import getUserSession from "@/services/getUserSession";
import { getLikedAlbums, getLikedPlaylists } from "@/services/api/me";
import { getPlaylists } from "@/services/api/playlists";
import PlaylistSection from "@/components/playlists/PlaylistSection";
import AlbumSection from "@/components/albums/AlbumSection";
import CreatePlaylistButton from "@/components/buttons/CreatePlaylistButton";
import { FaHistory, FaRegHeart } from "react-icons/fa";

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
        getLikedAlbums(session?.accessToken ?? "", { skip: 0, take: 5 }),
        getLikedPlaylists(session?.accessToken ?? "", { skip: 0, take: 5 }),
    ]);

    return (
        <main>
            <h2 className="text-yellow-50 text-3xl mb-5 font-medium">
                Bộ sưu tập
            </h2>

            <div className="my-8">
                <section
                    className={`grid md:grid-cols-4 lg:grid-cols-5 grid-cols-2 sm:gap-6 gap-3`}
                >
                    <Link
                        className="relative max-w-sm rounded overflow-hidden shadow-lg hover:bg-primary/30 bg-darkgray cursor-pointer p-4"
                        title="Nghe gần đây"
                        href={`/collection/history`}
                    >
                        <div className="text-primary">
                            <FaHistory size={50} />
                        </div>

                        <div className="pt-4 pb-2">
                            <div className="font-bold text-xl text-yellow-50 line-clamp-2">
                                Nghe gần đây
                            </div>
                        </div>
                    </Link>
                    <Link
                        className="relative max-w-sm rounded overflow-hidden shadow-lg hover:bg-primary/30 bg-darkgray cursor-pointer p-4"
                        title="Bài hát đã thích"
                        href={`/collection/liked-songs`}
                    >
                        <div className="text-error">
                            <FaRegHeart size={50}/>
                        </div>

                        <div className="pt-4 pb-2">
                            <div className="font-bold text-xl text-yellow-50 line-clamp-2">
                                Bài hát đã thích
                            </div>
                        </div>
                    </Link>
                </section>
            </div>

            {results[0].status === "fulfilled" && (
                <div className="my-8">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-2 items-center">
                            <h2 className="text-yellow-50 text-2xl font-medium">
                                Playlist
                            </h2>

                            <CreatePlaylistButton />
                        </div>

                        <Link
                            href={`/users/${session?.user.id}/playlists`}
                            className="text-gray-500 hover:underline"
                        >
                            Hiện tất cả
                        </Link>
                    </div>
                    <PlaylistSection
                        playlists={(results[0] as any).value?.results ?? []}
                    />
                </div>
            )}

            {results[1].status === "fulfilled" && (
                <div className="my-8">
                    <div className="flex items-center justify-between mb-3">
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
                        albums={(results[1] as any).value?.results ?? []}
                    />
                </div>
            )}

            {results[2].status === "fulfilled" && (
                <div className="my-8">
                    <div className="flex items-center justify-between mb-3">
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
                        playlists={(results[2] as any).value?.results ?? []}
                    />
                </div>
            )}
        </main>
    );
}
