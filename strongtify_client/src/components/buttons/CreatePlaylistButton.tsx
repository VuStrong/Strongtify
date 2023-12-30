"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "../modals/Modal";
import CreatePlaylistForm from "../playlists/CreatePlaylistForm";
import Button from "./Button";

export default function CreatePlaylistButton() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
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
