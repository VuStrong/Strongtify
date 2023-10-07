"use client";

import Link from "next/link";
import Image from "next/image";
import { Artist } from "@/types/artist";
import { DEFAULT_AVATAR_URL } from "@/libs/constants";

export default function ArtistItem({ artist }: { artist: Artist }) {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg hover:bg-primary/30 bg-darkgray cursor-pointer p-4" title={artist.name}>
            <Link href={`/artists/${artist.alias}/${artist.id}`}>
                <Image
                    className="w-full h-4/6 rounded-full object-cover"
                    width={150}
                    height={150}
                    src={artist.imageUrl ?? DEFAULT_AVATAR_URL}
                    alt={artist.name}
                />
                <div className="py-4">
                    <div className="font-bold text-xl text-yellow-50 mb-1 truncate">
                        {artist.name}
                    </div>
                    <p className="text-gray-500 text-base truncate">
                        {artist.followerCount} theo dõi
                    </p>
                </div>
            </Link>
        </div>
    );
}
