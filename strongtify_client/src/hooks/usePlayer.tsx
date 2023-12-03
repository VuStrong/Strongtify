import { create } from "zustand";

interface PlayerStore {
    ids: string[];
    currentIndex: number;
    path?: string;

    setIds: (ids: string[]) => void;
    setCurrentIndex: (index: number) => void;
    setPath: (path?: string) => void;
    reset: () => void;
}

const usePlayer = create<PlayerStore>((set) => ({
    ids: [],
    currentIndex: 0,
    path: undefined,
    
    setIds: (ids: string[]) => set({ ids }),
    setCurrentIndex: (index: number) => set({ currentIndex: index }),
    setPath: (path?: string) => set({ path }),
    reset: () => set({ ids: [], currentIndex: 0 }),
}));

export default usePlayer;
