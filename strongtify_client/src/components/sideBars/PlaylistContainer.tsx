"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import PlaylistSideBarItem from "./PlaylistSideBarItem";
import useRecentPlaylists from "@/hooks/useRecentPlaylists";

export default function PlaylistContainer() {
    const { status } = useSession();
    const { playlists, isLoading, fetchRecentPlaylists } = useRecentPlaylists();

    useEffect(() => {
        fetchRecentPlaylists();
    }, []);

    if (status !== "authenticated") {
        return null;
    }

    return (
        <section className="flex flex-col gap-3 mt-5 -mx-2">
            {!isLoading && playlists.length === 0 && (
                <div className="text-center text-xs text-yellow-50 font-bold">
                    <div className="text-lg">👆</div>
                    Ghé qua Bộ sưu tập để tạo playlist cho bạn nhé!
                </div>
            )}

            {playlists.map((playlist) => (
                <PlaylistSideBarItem key={playlist.id} playlist={playlist} />
            ))}
        </section>
    );
}
