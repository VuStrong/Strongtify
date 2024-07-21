import { create } from "zustand";

interface ModalState {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

interface ModalStore {
    songQueueModal: ModalState;
    createPlaylistModal: ModalState;
}

const useModal = create<ModalStore>((set) => ({
    songQueueModal: {
        isOpen: false,
        open: () => set(state => ({
            songQueueModal: {
                ...state.songQueueModal,
                isOpen: true,
            }
        })),
        close: () => set(state => ({
            songQueueModal: {
                ...state.songQueueModal,
                isOpen: false,
            }
        })),
    },
    createPlaylistModal: {
        isOpen: false,
        open: () => set(state => ({
            createPlaylistModal: {
                ...state.createPlaylistModal,
                isOpen: true,
            }
        })),
        close: () => set(state => ({
            createPlaylistModal: {
                ...state.createPlaylistModal,
                isOpen: false,
            }
        })),
    },
}));

export default useModal;
