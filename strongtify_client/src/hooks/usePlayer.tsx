import { Song } from "@/types/song";
import { create } from "zustand";

interface PlayerStore {
    songs: Song[];
    playingSong?: Song;
    path?: string;
    playlistId?: string;

    setSongs: (songs: Song[]) => void;
    setPlayingSong: (song: Song) => void;
    setPath: (path?: string) => void;

    setPlayer: (songs: Song[], index: number, playlistId?: string) => void;
}

const usePlayer = create<PlayerStore>((set) => ({
    songs: [],
    playingSong: undefined,
    path: undefined,
    playlistId: undefined,

    setSongs: (songs: Song[]) => set({ songs }),
    setPlayingSong: (song?: Song) => set({ playingSong: song }),
    setPath: (path?: string) => set({ path }),

    setPlayer: (songs: Song[], index: number, playlistId?: string) =>
        set({
            songs: songs,
            playingSong: songs[index],
            playlistId
        }),
}));

export default usePlayer;
