"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BiDotsVerticalRounded } from "react-icons/bi";

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
    const [isSongOptionsModalOpen, setIsSongOptionsModalOpen] =
        useState<boolean>(false);
    const [selectedSongId, setSelectedSongId] = useState<string>("");
    const songIds = useMemo(() => playlist.songs?.map(s => s.id) ?? [], [playlist.songs]);

    const router = useRouter();
    const player = usePlayer();
    const pathname = usePathname();
    const { data: session } = useSession();

    const DraggableList = useMemo(
        () =>
            dynamic(() => import("@/components/DraggableList"), { ssr: false }),
        [playlist.songs],
    );

    const handleRemoveSongFromPlaylist = useCallback(async () => {
        setIsSongOptionsModalOpen(false);

        const removeTask = async () => {
            await removeSongFromPlaylist(
                playlist.id,
                selectedSongId,
                session?.accessToken ?? "",
            );

            router.refresh();
        }

        toast.promise(removeTask(), {
            loading: "Đang xóa bài hát",
            success: "Đã xóa bài hát khỏi playlist",
            error: "Không thể xóa bài hát, hãy thử lại"
        });
    }, [selectedSongId, session?.accessToken]);

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
                                toast.success("Đã thêm bài hát vào playlist");
                                router.refresh();
                            } catch (error: any) {
                                toast.error(error.message);
                            }
                        }}
                    />
                </Modal>
            )}

            {/* Song options modal */}
            <Modal
                isOpen={isSongOptionsModalOpen}
                onClickClose={() => {
                    setIsSongOptionsModalOpen(false);
                }}
            >
                <div className="text-yellow-50 p-4 flex flex-col gap-3">
                    <Button
                        label="Xóa bài hát khỏi playlist này"
                        onClick={handleRemoveSongFromPlaylist}
                        outline
                    />
                </div>
            </Modal>

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
                        <div className="relative">
                            <div className="mr-6">
                                <SongItem
                                    song={item}
                                    index={index + 1}
                                    containLink
                                    canPlay
                                    isActive={player.ids[player.currentIndex] === item.id}
                                    onClickPlay={() => {
                                        player.setIds(songIds ?? []);
                                        player.setCurrentIndex(index);
                                        player.setPath(pathname ?? undefined);
                                    }}
                                />
                            </div>

                            <div
                                className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 text-yellow-50"
                                onClick={() => {
                                    setIsSongOptionsModalOpen(true);
                                    setSelectedSongId(item.id);
                                }}
                            >
                                <BiDotsVerticalRounded size={24} />
                            </div>
                        </div>
                    )}
                    onDrop={async (item: Song, index: number, items: Song[]) => {
                        await moveSongInPlaylist(
                            playlist.id,
                            item.id,
                            index,
                            session?.accessToken ?? "",
                        );

                        router.refresh();
                    }}
                />
            </section>
        </>
    );
}
