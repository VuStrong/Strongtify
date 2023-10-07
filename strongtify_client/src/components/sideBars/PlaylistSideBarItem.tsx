'use client'

import Image from "next/image";
import { Playlist } from "@/types/playlist"
import { NO_IMAGE_URL } from "@/libs/constants";
import Link from "next/link";

export default function PlaylistSideBarItem({
    playlist
}: {
    playlist: Playlist
}) {
    return (
        <Link 
            href={`/playlists/${playlist.id}`}
            className="flex gap-x-3 items-center w-full text-gray-300 p-2 hover:bg-primary/30"
            title={playlist.name}
        >
            <Image
                src={playlist.imageUrl ?? NO_IMAGE_URL}
                width={50}
                height={50}
                className="h-[50px] object-cover"
                alt={playlist.name}
            />

            <div className="flex-1 truncate">
                <div>
                    {playlist.name}
                </div>

                <div className="text-gray-500 text-sm">
                    Danh sách phát
                </div>
            </div>
        </Link>
    )
}