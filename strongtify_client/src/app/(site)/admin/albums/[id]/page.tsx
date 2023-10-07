import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAlbumById } from "@/services/api/albums";
import UpdateAlbumForm from "@/components/admin/albums/UpdateAlbumForm";
import AlbumSongList from "@/components/admin/albums/AlbumSongList";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    return {
        title: `Edit album ${params.id}`,
    };
}

export default async function AdminAlbumDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const album = await getAlbumById(params.id);

    if (!album) {
        notFound();
    }

    return (
        <section className="mb-5">
            <h1 className="text-primary text-4xl mb-7">Update {album?.name}</h1>

            <UpdateAlbumForm album={album} />

            <hr className="mt-8 mb-3" />

            <AlbumSongList album={album} />
        </section>
    );
}
