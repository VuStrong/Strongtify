import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAlbumById } from "@/services/api/albums";
import SongSection from "@/components/songs/SongSection";
import AlbumInfoCard from "@/components/albums/AlbumInfoCard";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const album = await getAlbumById(params.id);

    if (!album) notFound();

    return {
        title: `Album - ${album.name} | Strongtify`,
        description: `Album - ${album.name} | Strongtify`,
        openGraph: {
            title: `Album - ${album.name} | Strongtify`,
            description: `Album - ${album.name} | Strongtify`,
        }
    };
}

export default async function AlbumDetailPage({
    params,
}: {
    params: { id: string; alias: string };
}) {
    const album = await getAlbumById(params.id);

    if (!album) notFound();

    return (
        <main>
            <AlbumInfoCard album={album} />

            <div className="my-8">
                <h2 className="text-yellow-50 text-2xl font-medium mb-3">
                    Danh sách bài hát
                </h2>

                <SongSection songs={album.songs ?? []} oneColumn showIndex />
            </div>
        </main>
    );
}
