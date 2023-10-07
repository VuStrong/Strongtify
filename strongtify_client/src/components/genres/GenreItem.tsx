"use client";

import { NO_IMAGE_URL } from "@/libs/constants";
import { Genre } from "@/types/genre";
import Link from "next/link";

export default function GenreItem({ genre }: { genre: Genre }) {
    return (
        <Link
            href={`/genres/${genre.alias}/${genre.id}`}
            className={`rounded-lg bg-no-repeat bg-cover bg-center min-h-[100px]`}
            style={{
                backgroundImage: "url(" + genre.imageUrl ?? NO_IMAGE_URL + ")",
            }}
            title={genre.name}
        >
            <div className="text-yellow-50 text-xl font-extrabold bg-black/5 hover:bg-black/80 flex justify-center items-center w-full h-full p-4">
                <div className="truncate">{genre.name}</div>
            </div>
        </Link>
    );
}
