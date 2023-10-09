import { getArtistById } from "@/services/api/artists";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const artist = await getArtistById(params.id);

    if (!artist) notFound();

    return {
        title: `Nghệ sĩ - ${artist.name} | Strongtify`,
        description: artist.about ?? `Nghệ sĩ - ${artist.name} | Strongtify`,
        openGraph: {
            title: `Nghệ sĩ - ${artist.name} | Strongtify`,
            description: artist.about ?? `Nghệ sĩ - ${artist.name} | Strongtify`,
        }
    };
}

export default function ArtistDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
