import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UpdateSongForm from "@/components/admin/songs/UpdateSongForm";
import { getSongById } from "@/services/api/songs";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    return {
        title: `Edit song ${params.id}`,
    };
}

export default async function AdminSongDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const song = await getSongById(params.id);

    if (!song) {
        notFound();
    }

    return (
        <section className="mb-5">
            <h1 className="text-primary text-4xl mb-7">Update {song?.name}</h1>

            <UpdateSongForm song={song} />
        </section>
    );
}
