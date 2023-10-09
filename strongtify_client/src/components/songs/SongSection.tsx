"use client";

import { Song } from "@/types/song";
import SongItem from "./SongItem";
import Button from "../buttons/Button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SongSection({
    songs,
    showIndex,
    oneColumn,
}: {
    songs: Song[];
    showIndex?: boolean;
    oneColumn?: boolean;
}) {
    const router = useRouter();

    return (
        <section
            className={`grid sm:gap-3 gap-1 grid-cols-1 ${
                !oneColumn && "md:grid-cols-2 lg:grid-cols-3"
            }`}
        >
            {songs?.length === 0 && (
                <div className="text-gray-500">Không có kết quả</div>
            )}

            {songs.map((song, index) => (
                <SongItem
                    key={song.id}
                    index={showIndex ? index + 1 : undefined}
                    song={song}
                    containLink
                    containMenu
                    menu={(
                        <div className="text-yellow-50 p-4 flex flex-col gap-3">
                            <Button
                                label="Xem bài hát"
                                onClick={() => {
                                    router.push(`/songs/${song.alias}/${song.id}`);
                                }}
                                outline
                            />
                            <Button
                                label="Copy link bài hát"
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.hostname}/songs/${song.alias}/${song.id}`);
                                    toast.success("Đã copy link bài hát");
                                }}
                                outline
                            />
                        </div>
                    )}
                />
            ))}
        </section>
    );
}
