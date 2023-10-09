"use client";

import Link from "next/link";
import Image from "next/image";
import { AiFillLock } from "react-icons/ai";
import { Playlist } from "@/types/playlist";
import { DEFAULT_AVATAR_URL, NO_IMAGE_URL } from "@/libs/constants";

export default function PlaylistItem({ playlist }: { playlist: Playlist }) {
    return (
        <div
            className="relative max-w-sm rounded overflow-hidden shadow-lg hover:bg-primary/30 bg-darkgray cursor-pointer p-4"
            title={playlist.name}
        >
            <Link href={`/playlists/${playlist.id}`}>
                <Image
                    className="w-full h-1/2 object-cover"
                    width={150}
                    height={150}
                    src={playlist.imageUrl ?? NO_IMAGE_URL}
                    alt={playlist.name}
                />
                <div className="pt-4 pb-2">
                    <div className="font-bold text-xl text-yellow-50 line-clamp-2">
                        {playlist.name}
                    </div>

                    {playlist.status === "PRIVATE" && (
                        <div className="text-error absolute w-fit top-0 -left-1 text-2xl">
                            <AiFillLock />
                        </div>
                    )}
                </div>
            </Link>

            <div className="flex gap-2">
                <Image
                    className="rounded-full"
                    width={24}
                    height={24}
                    src={playlist.user.imageUrl ?? DEFAULT_AVATAR_URL}
                    alt={playlist.user.name}
                />
                <Link
                    href={`/users/${playlist.user.id}`}
                    className="text-gray-500 text-base truncate hover:underline"
                >
                    {playlist.user.name}
                </Link>
            </div>
        </div>
    );
}
