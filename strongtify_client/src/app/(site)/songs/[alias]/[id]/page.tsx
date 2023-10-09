import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSongById } from "@/services/api/songs";
import ArtistSection from "@/components/artists/ArtistSection";
import SongInfoCard from "@/components/songs/SongInfoCard";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const song = await getSongById(params.id);

    if (!song) notFound();

    return {
        title: `Bài hát - ${song.name} | Strongtify`,
        description: `Bài hát - ${song.name} | Strongtify`,
    };
}

export default async function SongDetailPage({
    params,
}: {
    params: { id: string; alias: string };
}) {
    const song = await getSongById(params.id);

    if (!song) notFound();

    return (
        <main>
            <SongInfoCard song={song} />

            <div className="my-8">
                <h2 className="text-yellow-50 text-2xl font-medium mb-5">
                    Nghệ sĩ
                </h2>
                <ArtistSection artists={song.artists ?? []} />
            </div>
        </main>
    );
}
