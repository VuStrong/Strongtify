"use client";

import usePlayer from "@/hooks/usePlayer";
import { AiFillPlayCircle } from "react-icons/ai";

export default function PlayButton({ songIds }: { songIds?: string[] }) {
    const player = usePlayer();

    const handleClick = () => {
        player.setIds(songIds ?? []);
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
