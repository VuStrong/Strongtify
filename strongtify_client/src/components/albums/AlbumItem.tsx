"use client";

import Link from "next/link";
import Image from "next/image";
import { NO_IMAGE_URL } from "@/libs/constants";
import { Album } from "@/types/album";

export default function AlbumItem({ album }: { album: Album }) {
    return (
        <div
            className="max-w-sm rounded overflow-hidden shadow-lg hover:bg-primary/30 bg-darkgray cursor-pointer p-4"
            title={album.name}
        >
            <Link href={`/albums/${album.alias}/${album.id}`}>
                <Image
                    className="w-full"
                    width={150}
                    height={150}
                    src={album.imageUrl ?? NO_IMAGE_URL}
                    alt={album.name}
                />
                <div className="font-bold text-xl text-yellow-50 mb-1 pt-4 line-clamp-2">
                    {album.name}
                </div>
            </Link>

            {album.artist ? (
                <Link
                    className="text-gray-500 text-base truncate hover:underline pb-4"
                    href={`/artists/${album.artist.alias}/${album.artist.id}`}
                >
                    {album.artist.name}
                </Link>
            ) : (
                <div className="text-gray-500 text-base truncate pb-4">
                    Strongtify
                </div>
            )}
        </div>
    );
}
