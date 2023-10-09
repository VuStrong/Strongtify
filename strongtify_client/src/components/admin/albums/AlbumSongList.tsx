"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

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

    const router = useRouter();
    const { data: session } = useSession();

    const DraggableList = useMemo(
        () =>
            dynamic(() => import("@/components/DraggableList"), { ssr: false }),
        [album.songs],
    );

    const handleRemoveSongFromAlbum = useCallback(async (songId: string) => {
        try {
            await removeSongFromAlbum(
                album.id,
                songId,
                session?.accessToken ?? "",
            );
            toast.success("Đã xóa bài hát khỏi album");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        }
    }, [session?.accessToken]);

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
                    initialItems={album.songs ?? []}
                    formatItem={(item: Song, index: number) => (
                        <SongItem
                            song={item}
                            index={index + 1}
                            containLink
                            containMenu
                            menu={(
                                <div className="text-yellow-50 p-4 flex flex-col gap-3">
                                    <Button
                                        label="Xóa bài hát khỏi album này"
                                        onClick={() => handleRemoveSongFromAlbum(item.id) }
                                        outline
                                    />
                                    <Button
                                        label="Xem chi tiết"
                                        onClick={() => {
                                            router.push(`/admin/songs/${item.id}`);
                                        }}
                                        outline
                                    />
                                </div>
                            )}
                        />
                    )}
                    onDrop={async (item: Song, index: number) => {
                        await moveSongInAlbum(
                            album.id,
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
