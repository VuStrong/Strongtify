"use client";

import { MdAddCircleOutline } from "react-icons/md";
import useModal from "@/hooks/store/useModal";

export default function CreatePlaylistButton({ 
    size = 30,
}: { 
    size?: number,
}) {
    const createPlaylistModal = useModal(state => state.createPlaylistModal);

    return (
        <>
            <button
                title="Tạo playlist mới"
                type="button"
                className="text-white hover:text-primary"
                onClick={createPlaylistModal.open}
            >
                <MdAddCircleOutline size={size} />
            </button>
        </>
    );
}
