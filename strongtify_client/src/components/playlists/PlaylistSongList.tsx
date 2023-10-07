"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
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

    const router = useRouter();
    const { data: session } = useSession();

    const DraggableList = useMemo(
        () =>
            dynamic(() => import("@/components/DraggableList"), { ssr: false }),
        [playlist.songs],
    );

    const handleRemoveSongFromPlaylist = useCallback(async () => {
        setIsSongOptionsModalOpen(false);

        try {
            await removeSongFromPlaylist(
                playlist.id,
                selectedSongId,
                session?.accessToken ?? "",
            );
            toast.success("Đã xóa bài hát khỏi playlist");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        }
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
                        <SongItem
                            song={item}
                            index={index + 1}
                            containLink
                            actionLabel={
                                <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setIsSongOptionsModalOpen(true);
                                        setSelectedSongId(item.id);
                                    }}
                                >
                                    <BiDotsVerticalRounded size={24} />
                                </div>
                            }
                        />
                    )}
                    onDrop={async (item: Song, index: number) => {
                        await moveSongInPlaylist(
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