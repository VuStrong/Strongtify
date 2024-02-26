"use client";

import PlaylistInfoCard from "@/components/playlists/PlaylistInfoCard";
import PlaylistSongList from "@/components/playlists/PlaylistSongList";
import SongSection from "@/components/songs/SongSection";
import usePlayer from "@/hooks/usePlayer";
import { PlaylistDetail } from "@/types/playlist";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function PlaylistDetail({
    playlist,
}: {
    playlist: PlaylistDetail;
}) {
    const { data: session } = useSession();
    const player = usePlayer();

    useEffect(() => {
        if (player.playlistId == playlist.id) {
            player.songs = playlist.songs ?? [];
        }
    }, [playlist]);

    return (
        <>
            <PlaylistInfoCard playlist={playlist} />

            <div className="my-8">
                {!session?.user || session.user.id !== playlist.user.id ? (
                    <>
                        <h2 className="text-yellow-50 text-2xl font-medium mb-3">
                            Danh sách bài hát
                        </h2>
                        <SongSection
                            songs={playlist.songs ?? []}
                            oneColumn
                            showIndex
                        />
                    </>
                ) : (
                    <PlaylistSongList playlist={playlist} />
                )}
            </div>
        </>
    );
}
