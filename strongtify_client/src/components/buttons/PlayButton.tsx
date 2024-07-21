"use client";

import usePlayer from "@/hooks/store/usePlayer";
import { Song } from "@/types/song";
import { usePathname } from "next/navigation";
import { AiFillPlayCircle } from "react-icons/ai";

export default function PlayButton({ 
    songs,
    playlistId,
}: { 
    songs: Song[],
    playlistId?: string,
}) {
    const player = usePlayer();
    const pathname = usePathname();

    const handleClick = function () {
        player.setPlayer(songs, 0, playlistId);
        player.setPath(pathname ?? undefined);
    };

    return (
        <button
            className={`text-primary hover:scale-105`}
            onClick={handleClick}
        >
            <AiFillPlayCircle size={48} />
        </button>
    );
}
