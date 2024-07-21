"use client";

import dynamic from "next/dynamic";
import { FaMinusCircle } from "react-icons/fa";
import usePlayer from "@/hooks/store/usePlayer";
import Modal from "../Modal";
import { Song } from "@/types/song";
import useModal from "@/hooks/store/useModal";
import SongItem from "@/components/songs/SongItem";
import SongMenuPopup from "@/components/songs/SongMenuPopup";

const DraggableList = dynamic(() => import("@/components/DraggableList"), {
    ssr: false,
});

export default function SongQueueModal() {
    const player = usePlayer();
    const songQueueModal = useModal(state => state.songQueueModal);

    return (
        <Modal
            isOpen={songQueueModal.isOpen}
            onClickClose={() => {
                songQueueModal.close();
            }}
        >
            <div className="px-4 py-3 sm:px-6">
                <h3 className="font-semibold leading-6 text-primary text-xl mb-2">
                    Danh sách chờ
                </h3>

                <div className="overflow-y-auto max-h-[300px] my-3">
                    <DraggableList
                        id="SongQueue"
                        autoPos
                        initialItems={player.songs ?? []}
                        formatItem={(song: Song, index: number) => (
                            <SongItem
                                key={song.id}
                                song={song}
                                containLink
                                canPlay
                                isActive={song.id === player.playingSong?.id}
                                onClickPlay={() => {
                                    player.setPlayer(player.songs, index);
                                }}
                                action={
                                    <SongMenuPopup 
                                        song={song} 
                                        anotherOptions={(close) => [
                                            <button
                                                onClick={() => {
                                                    player.removeSong(song.id);
                                                    close();
                                                }}
                                                className="hover:bg-gray-700 p-3 flex items-center gap-3 text-white"
                                            >
                                                <FaMinusCircle />
                                                Xóa khỏi danh sách chờ
                                            </button>,
                                        ]}
                                    />
                                }
                            />
                        )}
                    />
                </div>
            </div>
        </Modal>
    );
}
