"use client";

import usePlayer from "@/hooks/store/usePlayer";
import PlayerContent from "./PlayerContent";
import SongQueueModal from "../modals/globals/SongQueueModal";

export default function Player() {
    const player = usePlayer();

    if (!player.songs[0] || !player.playingSong) {
        return null;
    }

    return (
        <>
            <SongQueueModal />
            <div className="fixed bottom-0 left-0 w-full z-30 md:z-50">
                <PlayerContent song={player.playingSong} />
            </div>
        </>
    );
}
