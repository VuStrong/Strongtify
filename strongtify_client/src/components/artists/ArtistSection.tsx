"use client";

import { Artist } from "@/types/artist";
import ArtistItem from "./ArtistItem";

export default function ArtistSection({ artists }: { artists: Artist[] }) {
    return (
        <section
            className={`grid md:grid-cols-4 lg:grid-cols-5 grid-cols-2 sm:gap-6 gap-3`}
        >
            {artists?.length === 0 && (
                <div className="text-gray-500">Không có kết quả</div>
            )}

            {artists.map((artist) => (
                <ArtistItem key={artist.id} artist={artist} />
            ))}
        </section>
    );
}
