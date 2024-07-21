"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
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
import usePlayer from "@/hooks/store/usePlayer";
import SongMenuPopup from "../songs/SongMenuPopup";

const AddSongsContent = dynamic(
    () => import("@/components/modals/modal-contents/AddSongsContent"),
    { ssr: false },
);

const DraggableList = dynamic(() => import("@/components/DraggableList"), {
    ssr: false,
});

export default function PlaylistSongList({
    playlist,
    onSongAdded,
    onSongRemoved,
}: {
    playlist: PlaylistDetail;
    onSongAdded?: (song: Song) => void;
    onSongRemoved?: (songId: string) => void;
}) {
    const [isModalLoaded, setIsModalLoaded] = useState<boolean>(false);
    const [isAddSongsModalOpen, setIsAddSongsModalOpen] =
        useState<boolean>(false);

    const player = usePlayer();
    const pathname = usePathname();
    const { data: session } = useSession();

    const handleAddSongToPlaylist = async (song: Song) => {
        try {
            await addSongsToPlaylist(
                playlist.id,
                [song.id],
                session?.accessToken ?? "",
            );

            onSongAdded?.(song);

            if (player.playlistId === playlist.id) {
                player.addSong(song);
            }

            toast.success("Đã thêm bài hát vào playlist");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleRemoveSongFromPlaylist = async (songId: string) => {
        const removeTask = async () => {
            await removeSongFromPlaylist(
                playlist.id,
                songId,
                session?.accessToken ?? "",
            );

            onSongRemoved?.(songId);

            if (player.playlistId === playlist.id) {
                player.removeSong(songId);
            }
        };

        toast.promise(removeTask(), {
            loading: "Đang xóa bài hát",
            success: "Đã xóa bài hát khỏi playlist",
            error: "Không thể xóa bài hát, hãy thử lại",
        });
    };

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
                    <AddSongsContent onAdd={handleAddSongToPlaylist} />
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
                    id="PlaylistSongs"
                    initialItems={playlist.songs ?? []}
                    formatItem={(item: Song, index: number) => (
                        <SongItem
                            song={item}
                            index={index + 1}
                            containLink
                            canPlay
                            isActive={item.id === player.playingSong?.id}
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
                                                handleRemoveSongFromPlaylist(
                                                    item.id,
                                                );
                                                close();
                                            }}
                                            className="hover:bg-gray-700 p-3 flex items-center gap-3 text-white"
                                        >
                                            <FaMinusCircle />
                                            Xóa khỏi danh sách phát này
                                        </button>,
                                    ]}
                                />
                            }
                        />
                    )}
                    onDrop={async (item: Song, from: number, to: number) => {
                        moveSongInPlaylist(
                            playlist.id,
                            item.id,
                            to + 1,
                            session?.accessToken ?? "",
                        );

                        if (player.playlistId === playlist.id) {
                            player.move(from, to);
                        }
                    }}
                />
            </section>
        </>
    );
}
