"use client";

import { Session } from "next-auth";
import PlaylistInfoCard from "@/components/playlists/PlaylistInfoCard";
import PlaylistSongList from "@/components/playlists/PlaylistSongList";
import SongSection from "@/components/songs/SongSection";
import useForceUpdate from "@/hooks/useForceUpdate";
import { PlaylistDetail } from "@/types/playlist";

export default function PlaylistDetailClientPage({
    playlist,
    session = null,
}: {
    playlist: PlaylistDetail;
    session: Session | null
}) {
    const forceUpdate = useForceUpdate();

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
                    <PlaylistSongList playlist={playlist} onSongsChange={forceUpdate} />
                )}
            </div>
        </>
    );
}
