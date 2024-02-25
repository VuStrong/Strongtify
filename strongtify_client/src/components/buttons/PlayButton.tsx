"use client";

import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types/song";
import { usePathname } from "next/navigation";
import { AiFillPlayCircle } from "react-icons/ai";

export default function PlayButton({ songs }: { songs: Song[] }) {
    const player = usePlayer();
    const pathname = usePathname();

    const handleClick = function () {
        player.setPlayer(songs, 0);
        player.setPath(pathname ?? undefined);
    };

    return (
        <div
            className={`text-primary text-5xl w-fit cursor-pointer hover:scale-105`}
            onClick={handleClick}
        >
            <AiFillPlayCircle />
        </div>
    );
}
