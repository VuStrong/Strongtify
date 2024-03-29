"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineAdd } from "react-icons/md";
import { FaMinusCircle } from "react-icons/fa";

import { Song } from "@/types/song";
import Modal from "@/components/modals/Modal";
import SongItem from "@/components/songs/SongItem";
import { PlaylistDetail } from "@/types/playlist";
import {
    addSongsToPlaylist,
    moveSongInPlaylist,
    removeSongFromPlaylist,
} from "@/services/api/playlists";
import usePlayer from "@/hooks/usePlayer";
import SongMenuPopup from "../songs/SongMenuPopup";

const AddSongsContent = dynamic(
    () => import("@/components/modals/modal-contents/AddSongsContent"),
    { ssr: false },
);

const DraggableList = dynamic(
    () => import("@/components/DraggableList"),
    { ssr: false },
);

export default function PlaylistSongList({
    playlist,
    onSongsChange
}: {
    playlist: PlaylistDetail;
    onSongsChange: () => void;
}) {
    const [isModalLoaded, setIsModalLoaded] = useState<boolean>(false);
    const [isAddSongsModalOpen, setIsAddSongsModalOpen] =
        useState<boolean>(false);

    const player = usePlayer();
    const pathname = usePathname();
    const { data: session } = useSession();

    const handleRemoveSongFromPlaylist = async (songId: string) => {
        const removeTask = async () => {
            await removeSongFromPlaylist(
                playlist.id,
                songId,
                session?.accessToken ?? "",
            );

            const removedIndex =
                playlist.songs?.findIndex((s) => s.id === songId) ?? -1;
            if (removedIndex >= 0) {
                const removedSongs = playlist.songs?.splice(removedIndex, 1);
                playlist.songCount -= 1;
                playlist.totalLength -= removedSongs?.[0].length ?? 0;

                onSongsChange();
            }
        };

        toast.promise(removeTask(), {
            loading: "Đang xóa bài hát",
            success: "Đã xóa bài hát khỏi playlist",
            error: "Không thể xóa bài hát, hãy thử lại",
        });
    };

    useEffect(() => {
        if (player.playlistId == playlist.id) {
            player.songs = playlist.songs ?? [];
        }
    }, [playlist]);

    return (
        <>
            {/* Add songs modal */}
            {isModalLoaded && (
                <Modal
                    isOpen={isAddSongsModalOpen}
                    onClickClose={() => {
                        setIsAddSongsModalOpen(false);
                    }}
                >
                    <AddSongsContent
                        onAdd={async (song: Song) => {
                            try {
                                await addSongsToPlaylist(
                                    playlist.id,
                                    [song.id],
                                    session?.accessToken ?? "",
                                );
                                playlist.songs?.push(song);
                                playlist.songCount += 1;
                                playlist.totalLength += song.length;

                                onSongsChange();

                                toast.success("Đã thêm bài hát vào playlist");
                            } catch (error: any) {
                                toast.error(error.message);
                            }
                        }}
                    />
                </Modal>
            )}

            <section>
                <h2 className="text-yellow-50 text-2xl font-medium mb-3">
                    Danh sách bài hát
                </h2>

                <button 
                    className="flex gap-x-5 items-center w-full text-gray-300 py-2 mb-3 hover:bg-darkgray"
                    onClick={() => {
                        if (!isModalLoaded) setIsModalLoaded(true);
                        setIsAddSongsModalOpen(true);
                    }}
                >
                    <div className="bg-darkgray w-[50px] h-[50px] flex items-center justify-center">
                        <MdOutlineAdd size={40} />
                    </div>
                    <div>Thêm bài hát vào playlist này</div>
                </button>

                <DraggableList
                    initialItems={playlist.songs ?? []}
                    formatItem={(item: Song, index: number) => (
                        <SongItem
                            song={item}
                            index={index + 1}
                            containLink
                            canPlay
                            isActive={
                                item.id === player.playingSong?.id
                            }
                            onClickPlay={() => {
                                player.setPlayer(
                                    playlist.songs ?? [],
                                    index,
                                    playlist.id,
                                );
                                player.setPath(pathname ?? undefined);
                            }}
                            action={
                                <SongMenuPopup 
                                    song={item}
                                    anotherOptions={(close) => [
                                        <button
                                            onClick={() => {
                                                handleRemoveSongFromPlaylist(item.id);
                                                close();
                                            }}
                                            className="hover:bg-gray-700 p-3 flex items-center gap-3 text-white"
                                        >
                                            <FaMinusCircle />
                                            Xóa khỏi danh sách phát này
                                        </button>
                                    ]}
                                />
                            }
                        />
                    )}
                    onDrop={async (
                        item: Song,
                        index: number,
                        items: Song[],
                    ) => {
                        moveSongInPlaylist(
                            playlist.id,
                            item.id,
                            index,
                            session?.accessToken ?? "",
                        );
                    }}
                />
            </section>
        </>
    );
}
