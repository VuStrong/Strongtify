"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import { Song } from "@/types/song";
import { getListenHistory, removeListenHistory } from "@/services/api/me";
import SongSectionLoading from "@/components/loadings/SongSectionLoading";
import toast from "react-hot-toast";
import SongItem from "@/components/songs/SongItem";
import usePlayer from "@/hooks/store/usePlayer";
import { usePathname } from "next/navigation";
import SongMenuPopup from "@/components/songs/SongMenuPopup";
import { FaHistory } from "react-icons/fa";

export default function History() {
    const [end, setEnd] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [songs, setSongs] = useState<Song[]>();
    const player = usePlayer();
    const pathname = usePathname();

    const { data: session, status } = useSession();

    useEffect(() => {
        const get = async () => {
            const data = await getListenHistory(session?.accessToken ?? "", {
                skip: 0,
                take: 20,
            });

            setSongs(data?.results);
            setSkip(0);
            setEnd(data?.end ?? true);
            setIsLoading(false);
        };

        if (status !== "loading") get();
    }, [status]);

    const fetchMoreSongs = async () => {
        const data = await getListenHistory(session?.accessToken ?? "", {
            skip: skip + 20,
            take: 20,
        });

        setSongs([...(songs ?? []), ...(data?.results ?? [])]);
        setSkip(skip + 20);
        setEnd(data?.end ?? true);
    };

    const handleRemoveSongFromHistory = async (songId: string) => {
        const removeTask = async () => {
            await removeListenHistory(songId, session?.accessToken ?? "");

            setSongs(songs?.filter(s => s.id !== songId));
        };

        toast.promise(removeTask(), {
            loading: "Đang xóa bài hát",
            success: "Đã xóa bài hát khỏi danh sách nghe gần đây",
            error: "Không thể xóa bài hát, hãy thử lại",
        });
    };

    return (
        <main className="py-5">
            <h2 className="text-yellow-50 text-2xl mb-5 font-medium">
                Nghe gần đây
            </h2>

            {isLoading && <SongSectionLoading count={20} oneColumn />}

            {!isLoading && (
                <InfiniteScroll
                    dataLength={skip + 20}
                    next={fetchMoreSongs}
                    hasMore={!end}
                    loader={
                        <div className="flex justify-center">
                            <BeatLoader color="#f58c1b" />
                        </div>
                    }
                >
                    <section className={`grid sm:gap-3 gap-1 grid-cols-1`}>
                        {songs?.length === 0 && (
                            <div className="text-gray-500">
                                Không có kết quả
                            </div>
                        )}

                        {songs?.map((song, index) => (
                            <SongItem
                                key={song.id}
                                song={song}
                                containLink
                                canPlay
                                isActive={song.id === player.playingSong?.id}
                                onClickPlay={() => {
                                    player.setPlayer(songs, index);
                                    player.setPath(pathname ?? undefined);
                                }}
                                action={
                                    <SongMenuPopup
                                        song={song}
                                        anotherOptions={(close) => [
                                            <button
                                                onClick={() => {
                                                    handleRemoveSongFromHistory(song.id);
                                                    close();
                                                }}
                                                className="hover:bg-gray-700 p-3 flex items-center gap-3 text-white"
                                            >
                                                <FaHistory />
                                                Xóa khỏi danh sách nghe gần đây
                                            </button>,
                                        ]}
                                    />
                                }
                            />
                        ))}
                    </section>
                </InfiniteScroll>
            )}
        </main>
    );
}
