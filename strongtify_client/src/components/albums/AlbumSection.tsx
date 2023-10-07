"use client";

import { Album } from "@/types/album";
import AlbumItem from "./AlbumItem";

export default function AlbumSection({ albums }: { albums: Album[] }) {
    return (
        <section
            className={`grid md:grid-cols-4 lg:grid-cols-5 grid-cols-2 sm:gap-6 gap-3`}
        >
            {albums?.length === 0 && (
                <div className="text-gray-500">Không có kết quả</div>
            )}

            {albums.map((album) => (
                <AlbumItem key={album.id} album={album} />
            ))}
        </section>
    );
}
