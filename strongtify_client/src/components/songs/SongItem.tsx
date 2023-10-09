"use client";

import Link from "next/link";
import Image from "next/image";

import { Song } from "@/types/song";
import { NO_IMAGE_URL } from "@/libs/constants";
import { formatLength } from "@/libs/utils";

export default function SongItem({
    song,
    index,
    containLink,
    actionLabel,
}: {
    song: Song;
    index?: number;
    containLink?: boolean;
    actionLabel?: React.ReactNode;
}) {
    return (
        <div
            className="flex gap-x-3 items-center w-full text-gray-300 p-2 hover:bg-darkgray"
            title={song.name}
        >
            {index && <div className="w-[30px] text-center">{index}</div>}

            <Image
                src={song.imageUrl ?? NO_IMAGE_URL}
                width={50}
                height={50}
                alt={song.name}
            />

            <div className="flex-1 truncate">
                <Link
                    href={containLink ? `/songs/${song.alias}/${song.id}` : "#"}
                    className="hover:underline"
                >
                    {song.name}
                </Link>

                <div className="text-gray-500 text-sm">
                    {song.artists?.map((artist) => (
                        <Link
                            href={
                                containLink
                                    ? `/artists/${artist.alias}/${artist.id}`
                                    : "#"
                            }
                            className="hover:underline"
                            key={artist.id}
                        >
                            {artist.name}
                            <span>, </span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="md:block hidden">{formatLength(song.length)}</div>

            {actionLabel}
        </div>
    );
}
