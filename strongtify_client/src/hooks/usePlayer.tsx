import { create } from "zustand";

interface PlayerStore {
    ids: string[];
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
    setIds: (ids: string[]) => void;
    reset: () => void;
}

const usePlayer = create<PlayerStore>((set) => ({
    ids: [],
    currentIndex: 0,
    setCurrentIndex: (index: number) => set({ currentIndex: index }),
    setIds: (ids: string[]) => set({ ids }),
    reset: () => set({ ids: [], currentIndex: 0 }),
}));

export default usePlayer;
