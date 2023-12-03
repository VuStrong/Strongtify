"use client";

import Link from "next/link";
import Image from "next/image";
import { BsFillPlayFill } from "react-icons/bs";

import { Song } from "@/types/song";
import { NO_IMAGE_URL } from "@/libs/constants";
import { formatLength } from "@/libs/utils";

export default function SongItem({
    song,
    index,
    isActive,
    containLink,
    canPlay,
    onClickPlay
}: {
    song: Song;
    index?: number;
    isActive?: boolean;
    containLink?: boolean;
    canPlay?: boolean;
    onClickPlay?: () => void;
}) {
    return (
        <div
            className={`
                flex gap-x-3 items-center w-full text-gray-300 p-2 hover:bg-darkgray group
                ${isActive && "bg-primary/30"}
            `}
            title={song.name}
        >
            {index && <div className="w-[30px] text-center">{index}</div>}

            <div className="w-fit relative">
                <Image
                    src={song.imageUrl ?? NO_IMAGE_URL}
                    width={50}
                    height={50}
                    alt={song.name}
                />

                {canPlay && (
                    <div 
                        className="absolute cursor-pointer bg-black/70 w-full h-full top-0 text-primary invisible group-hover:visible flex justify-center items-center"
                        onClick={onClickPlay}
                    >
                        <BsFillPlayFill size={40}/>
                    </div>
                )}
            </div>

            <div className="flex-1 truncate">
                <Link
                    href={containLink ? `/songs/${song.alias}/${song.id}` : "#"}
                    className={`hover:underline ${isActive && "text-primary"}`}
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
        </div>
    );
}
