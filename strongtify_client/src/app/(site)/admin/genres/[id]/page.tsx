import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGenreById } from "@/services/api/genres";
import UpdateGenreForm from "@/components/admin/genres/UpdateGenreForm";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    return {
        title: `Edit genre ${params.id}`,
    };
}

export default async function AdminGenreDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const genre = await getGenreById(params.id);

    if (!genre) {
        notFound();
    }

    return (
        <section className="mb-5">
            <h1 className="text-primary text-4xl mb-7">Update {genre?.name}</h1>

            <UpdateGenreForm genre={genre} />
        </section>
    );
}
