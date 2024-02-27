import { Metadata } from "next";
import { notFound } from "next/navigation";
import getUserSession from "@/services/getUserSession";
import { getPlaylistById } from "@/services/api/playlists";
import PlaylistDetailClientPage from "./detail";

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
        description:
            playlist.description ?? `Playlist - ${playlist.name} | Strongtify`,
        openGraph: {
            title: `Playlist - ${playlist.name} | Strongtify`,
            description:
                playlist.description ??
                `Playlist - ${playlist.name} | Strongtify`,
        },
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
            <PlaylistDetailClientPage playlist={playlist} session={session} />
        </main>
    );
}
