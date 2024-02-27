"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "../modals/Modal";
import CreatePlaylistForm from "../playlists/CreatePlaylistForm";
import Button from "./Button";
import useRecentPlaylists from "@/hooks/useRecentPlaylists";

export default function CreatePlaylistButton() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const fetchRecentPlaylists = useRecentPlaylists(state => state.fetchRecentPlaylists);
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

            <Button
                label="Tạo playlist mới"
                onClick={() => {
                    setIsCreateModalOpen(true);
                }}
            />
        </>
    );
}
