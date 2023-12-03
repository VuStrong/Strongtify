"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Song } from "@/types/song";
import SongItem from "./SongItem";
import usePlayer from "@/hooks/usePlayer";

export default function SongSection({
    songs,
    showIndex,
    oneColumn,
}: {
    songs: Song[];
    showIndex?: boolean;
    oneColumn?: boolean;
}) {
    const player = usePlayer();
    const pathname = usePathname();

    const songIds = useMemo(() => songs.map(s => s.id), [songs]);

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
                    canPlay
                    isActive={player.ids[player.currentIndex] === song.id}
                    onClickPlay={() => {
                        player.setIds(songIds);
                        player.setCurrentIndex(index);
                        player.setPath(pathname ?? undefined);
                    }}
                />
            ))}
        </section>
    );
}
