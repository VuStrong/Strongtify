"use client";

import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContent";

export default function Player() {
    const player = usePlayer();

    if (!player.songs[0] || !player.playingSong) {
        return null;
    }

    return (
        <div className="fixed bg-orange-800 px-4 py-3 bottom-0 left-0 w-full z-30 md:z-50">
            <PlayerContent song={player.playingSong} />
        </div>
    );
}
