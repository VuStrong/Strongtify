import { Metadata } from "next";
import { notFound } from "next/navigation";
import getUserSession from "@/services/getUserSession";
import { getPlaylistById } from "@/services/api/playlists";
import SongSection from "@/components/songs/SongSection";
import PlaylistSongList from "@/components/playlists/PlaylistSongList";
import PlaylistInfoCard from "@/components/playlists/PlaylistInfoCard";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const session = await getUserSession();
    const playlist = await getPlaylistById(params.id, session?.accessToken);

    if (!playlist) notFound();

    return {
        title: `Playlist - ${playlist.name} | Strongtify`,
        description: `Playlist - ${playlist.name} | Strongtify`,
    };
}

export default async function PlaylistDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await getUserSession();
    const playlist = await getPlaylistById(params.id, session?.accessToken);

    if (!playlist) notFound();

    return (
        <main>
            <PlaylistInfoCard playlist={playlist} />

            <div className="my-8">
                {!session?.user || session.user.id !== playlist.user.id ? (
                    <>
                        <h2 className="text-yellow-50 text-2xl font-medium mb-3">
                            Danh sách bài hát
                        </h2>
                        <SongSection
                            songs={playlist.songs ?? []}
                            oneColumn
                            showIndex
                        />
                    </>
                ) : (
                    <PlaylistSongList playlist={playlist} />
                )}
            </div>
        </main>
    );
}
