"use client";

import { useState } from "react";
import PlaylistInfoCard from "@/components/playlists/PlaylistInfoCard";
import PlaylistSongList from "@/components/playlists/PlaylistSongList";
import SongSection from "@/components/songs/SongSection";
import { PlaylistDetail } from "@/types/playlist";
import { Song } from "@/types/song";

export default function Detail({
    initialPlaylist,
    userOwned,
}: {
    initialPlaylist: PlaylistDetail;
    userOwned: boolean;
}) {
    const [playlist, setPlaylist] = useState<PlaylistDetail>(initialPlaylist);

    const onSongAdded = (song: Song) => {
        playlist.songs?.push(song);
        playlist.songCount += 1;
        playlist.totalLength += song.length;

        setPlaylist({ ...playlist });
    };

    const onSongRemoved = (songId: string) => {
        const removedIndex =
            playlist.songs?.findIndex((s) => s.id === songId) ?? -1;
        if (removedIndex >= 0) {
            const removedSongs = playlist.songs?.splice(removedIndex, 1);
            playlist.songCount -= 1;
            playlist.totalLength -= removedSongs?.[0].length ?? 0;

            setPlaylist({ ...playlist });
        }
    };

    return (
        <>
            <PlaylistInfoCard 
                playlist={playlist} 
                onPlaylistInfoUpdated={(updatedPlaylist) => {
                    setPlaylist({ ...updatedPlaylist });
                }}
            />

            <div className="my-8">
                {userOwned ? (
                    <PlaylistSongList
                        playlist={playlist}
                        onSongAdded={onSongAdded}
                        onSongRemoved={onSongRemoved}
                    />
                ) : (
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
                )}
            </div>
        </>
    );
}
