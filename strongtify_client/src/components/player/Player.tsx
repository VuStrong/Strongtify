"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import usePlayer from "@/hooks/usePlayer";
import useGetSongById from "@/hooks/useGetSongById";

export default function Player() {
    const player = usePlayer();
    const { song } = useGetSongById(player.ids[player.currentIndex]);

    const PlayerContent = useMemo(
        () => dynamic(() => import("./PlayerContent"), { ssr: false }),
        [song],
    );

    if (!player.ids[0] || !song) {
        return null;
    }

    return (
        <div className="fixed bg-orange-800 px-4 py-3 bottom-0 left-0 w-full z-30 md:z-50">
            <PlayerContent song={song} />
        </div>
    );
}
