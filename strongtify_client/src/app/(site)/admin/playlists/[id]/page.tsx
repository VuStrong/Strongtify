import { Metadata } from "next";
import { notFound } from "next/navigation";
import UpdatePlaylistForm from "@/components/admin/playlists/UpdatePlaylistForm";
import { getPlaylistById } from "@/services/api/playlists";
import getUserSession from "@/services/getUserSession";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    return {
        title: `Edit playlist ${params.id}`,
    };
}

export default async function AdminPlaylistDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await getUserSession();
    const playlist = await getPlaylistById(params.id, session?.accessToken);

    if (!playlist) {
        notFound();
    }

    return (
        <section className="mb-5">
            <h1 className="text-primary text-4xl mb-2">Playlist: {playlist.name}</h1>
            <p className="text-error mb-7">Lưu ý: chỉ được thay đổi playlist của User nếu nó vi phạm nội quy :&gt;</p>

            <UpdatePlaylistForm playlist={playlist} />
        </section>
    )
}