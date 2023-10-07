"use client";

import { Playlist } from "@/types/playlist";
import PlaylistItem from "./PlaylistItem";

export default function PlaylistSection({
    playlists,
}: {
    playlists: Playlist[];
}) {
    return (
        <section
            className={`grid md:grid-cols-4 lg:grid-cols-5 grid-cols-2 sm:gap-6 gap-3`}
        >
            {playlists?.length === 0 && (
                <div className="text-gray-500">Không có kết quả</div>
            )}

            {playlists.map((playlist) => (
                <PlaylistItem key={playlist.id} playlist={playlist} />
            ))}
        </section>
    );
}
