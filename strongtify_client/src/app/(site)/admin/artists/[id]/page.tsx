import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UpdateArtistForm from "@/components/admin/artists/UpdateArtistForm";
import { getArtistById } from "@/services/api/artists";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    return {
        title: `Edit artist ${params.id}`,
    };
}

export default async function AdminArtistDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const artist = await getArtistById(params.id);

    if (!artist) {
        notFound();
    }

    return (
        <section className="mb-5">
            <h1 className="text-primary text-4xl mb-7">
                Update {artist?.name}
            </h1>

            <UpdateArtistForm artist={artist} />
        </section>
    );
}
