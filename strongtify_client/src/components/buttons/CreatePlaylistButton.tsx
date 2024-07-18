"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "../modals/Modal";
import CreatePlaylistForm from "../playlists/CreatePlaylistForm";
import useRecentPlaylists from "@/hooks/useRecentPlaylists";
import { MdAddCircleOutline } from "react-icons/md";

export default function CreatePlaylistButton({ 
    size = 30,
}: { 
    size?: number,
}) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const fetchRecentPlaylists = useRecentPlaylists(
        (state) => state.fetchRecentPlaylists,
    );
    const router = useRouter();

    return (
        <>
            <Modal
                isOpen={isCreateModalOpen}
                onClickClose={() => {
                    setIsCreateModalOpen(false);
                }}
            >
                <CreatePlaylistForm
                    onCreating={() => {
                        setIsCreateModalOpen(false);
                    }}
                    onCreated={() => {
                        setIsCreateModalOpen(false);

                        fetchRecentPlaylists();

                        router.refresh();
                    }}
                />
            </Modal>

            <button
                title="Tạo playlist mới"
                type="button"
                className="text-white hover:text-primary"
                onClick={() => {
                    setIsCreateModalOpen(true);
                }}
            >
                <MdAddCircleOutline size={size} />
            </button>
        </>
    );
}
