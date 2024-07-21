"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BiDotsVerticalRounded } from "react-icons/bi";

import { AlbumDetail } from "@/types/album";
import { Song } from "@/types/song";
import {
    addSongsToAlbum,
    moveSongInAlbum,
    removeSongFromAlbum,
} from "@/services/api/albums";
import Button from "@/components/buttons/Button";
import Modal from "@/components/modals/Modal";
import SongItem from "@/components/songs/SongItem";

const AddSongsContent = dynamic(
    () => import("@/components/modals/modal-contents/AddSongsContent"),
    { ssr: false },
);

export default function AlbumSongList({ album }: { album: AlbumDetail }) {
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
        [album.songs],
    );

    const handleRemoveSongFromAlbum = useCallback(async () => {
        setIsSongOptionsModalOpen(false);

        try {
            await removeSongFromAlbum(
                album.id,
                selectedSongId,
                session?.accessToken ?? "",
            );
            toast.success("Đã xóa bài hát khỏi album");
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
                                await addSongsToAlbum(
                                    album.id,
                                    [song.id],
                                    session?.accessToken ?? "",
                                );
                                toast.success("Đã thêm bài hát vào album");
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
                        label="Xem chi tiết"
                        onClick={() => {
                            setIsSongOptionsModalOpen(false);
                            router.push(`/admin/songs/${selectedSongId}`);
                        }}
                        outline
                    />
                    <Button
                        label="Xóa bài hát khỏi album này"
                        onClick={handleRemoveSongFromAlbum}
                        outline
                    />
                </div>
            </Modal>

            <section>
                <h2 className="text-3xl text-primary mb-5">
                    Song list
                    <span className="text-xl"> ({album.songCount})</span>
                </h2>

                <div className="w-fit mb-5">
                    <Button
                        type="button"
                        bgType="success"
                        label={"Add song to this album"}
                        onClick={() => {
                            if (!isModalLoaded) setIsModalLoaded(true);
                            setIsAddSongsModalOpen(true);
                        }}
                    />
                </div>

                <DraggableList
                    id="AlbumSongs"
                    initialItems={album.songs ?? []}
                    formatItem={(item: Song, index: number) => (
                        <div className="relative">
                            <div className="mr-6">
                                <SongItem song={item} index={index + 1} />
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
                    onDrop={async (item: Song, from: number, to: number) => {
                        await moveSongInAlbum(
                            album.id,
                            item.id,
                            to + 1,
                            session?.accessToken ?? "",
                        );
                    }}
                />
            </section>
        </>
    );
}
