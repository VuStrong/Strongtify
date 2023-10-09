"use client";

import { Song } from "@/types/song";
import SongItem from "./SongItem";

export default function SongSection({
    songs,
    showIndex,
    oneColumn,
}: {
    songs: Song[];
    showIndex?: boolean;
    oneColumn?: boolean;
}) {
    return (
        <section
            className={`grid sm:gap-3 gap-1 grid-cols-1 ${
                !oneColumn && "md:grid-cols-2 lg:grid-cols-3"
            }`}
        >
            {songs?.length === 0 && (
                <div className="text-gray-500">Không có kết quả</div>
            )}

            {songs.map((song, index) => (
                <SongItem
                    key={song.id}
                    index={showIndex ? index + 1 : undefined}
                    song={song}
                    containLink
                />
            ))}
        </section>
    );
}
