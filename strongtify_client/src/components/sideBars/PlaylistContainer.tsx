"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { MdOutlineAdd } from "react-icons/md";
import PlaylistSideBarItem from "./PlaylistSideBarItem";
import useRecentPlaylists from "@/hooks/store/useRecentPlaylists";
import useModal from "@/hooks/store/useModal";

export default function PlaylistContainer() {
    const { status } = useSession();
    const { playlists, fetchRecentPlaylists } = useRecentPlaylists();
    const createPlaylistModal = useModal(state => state.createPlaylistModal);

    useEffect(() => {
        if (status === "authenticated") fetchRecentPlaylists();
    }, [status]);

    if (status !== "authenticated") {
        return null;
    }

    return (
        <section className="flex flex-col gap-3 -mx-2">
            <button 
                className="flex gap-x-3 items-center w-full text-gray-300 p-2 hover:bg-primary/30"
                onClick={createPlaylistModal.open}
            >
                <div className="bg-gray-800 w-[50px] h-[50px] flex items-center justify-center">
                    <MdOutlineAdd size={40} />
                </div>
                <div className="flex-1 truncate text-left">
                    Tạo playlist mới
                </div>
            </button>

            {playlists.map((playlist) => (
                <PlaylistSideBarItem key={playlist.id} playlist={playlist} />
            ))}
        </section>
    );
}
