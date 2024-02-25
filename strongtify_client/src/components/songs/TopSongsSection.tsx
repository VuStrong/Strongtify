"use client";

import { usePathname } from "next/navigation";
import {
    PiNumberCircleOneBold,
    PiNumberCircleThreeBold,
    PiNumberCircleTwoBold,
} from "react-icons/pi";
import { TopSong } from "@/types/song";
import SongItem from "./SongItem";
import usePlayer from "@/hooks/usePlayer";

export default function TopSongsSection({ topSongs }: { topSongs: TopSong[] }) {
    const player = usePlayer();
    const pathname = usePathname();

    return (
        <section className={`grid grid-cols-1 sm:gap-3 gap-1`}>
            {topSongs?.length === 0 && (
                <div className="text-gray-500">Không có kết quả</div>
            )}

            {topSongs.map((song, index) => (
                <div className="w-full relative" key={song.id}>
                    <div className="absolute top-1/2 -translate-y-1/2 w-[40px] flex justify-center items-center">
                        {index === 0 && (
                            <div className="text-blue-400">
                                <PiNumberCircleOneBold size={40} />
                            </div>
                        )}

                        {index === 1 && (
                            <div className="text-green-400">
                                <PiNumberCircleTwoBold size={40} />
                            </div>
                        )}

                        {index === 2 && (
                            <div className="text-red-400">
                                <PiNumberCircleThreeBold size={40} />
                            </div>
                        )}

                        {index > 2 && (
                            <div className="text-yellow-50 text-3xl">
                                {index + 1}
                            </div>
                        )}
                    </div>

                    <div className="ml-12">
                        <SongItem
                            key={song.id}
                            song={song}
                            containLink
                            canPlay
                            isActive={song.id == player.playingSong?.id}
                            onClickPlay={() => {
                                player.setPlayer(topSongs, index);
                                player.setPath(pathname ?? undefined);
                            }}
                        />
                    </div>
                </div>
            ))}
        </section>
    );
}
