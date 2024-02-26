"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { Song } from "@/types/song";
import Button from "@/components/buttons/Button";
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
import { FaMinusCircle } from "react-icons/fa";

const AddSongsContent = dynamic(
    () => import("@/components/modals/modal-contents/AddSongsContent"),
    { ssr: false },
);

export default function PlaylistSongList({
    playlist,
}: {
    playlist: PlaylistDetail;
}) {
    const [isModalLoaded, setIsModalLoaded] = useState<boolean>(false);
    const [isAddSongsModalOpen, setIsAddSongsModalOpen] =
        useState<boolean>(false);

    const player = usePlayer();
    const pathname = usePathname();
    const { data: session } = useSession();

    const DraggableList = useMemo(
        () =>
            dynamic(() => import("@/components/DraggableList"), { ssr: false }),
        [],
    );

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
                if (removedSongs)
                    playlist.totalLength -= removedSongs[0].length;
                player.setSongs(playlist.songs ?? []);
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

                                player.setSongs(playlist.songs ?? []);

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

                <div className="w-fit mb-5">
                    <Button
                        type="button"
                        bgType="success"
                        label={"Thêm bài hát vào playlist"}
                        onClick={() => {
                            if (!isModalLoaded) setIsModalLoaded(true);
                            setIsAddSongsModalOpen(true);
                        }}
                    />
                </div>

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
                                            className="hover:bg-gray-700 p-3 flex items-center gap-3"
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
