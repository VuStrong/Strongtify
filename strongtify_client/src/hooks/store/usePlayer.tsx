import { Song } from "@/types/song";
import { create } from "zustand";

interface PlayerStore {
    songs: Song[];
    playingSong?: Song;
    path?: string;
    playlistId?: string;

    setPath: (path?: string) => void;

    setPlayer: (songs: Song[], index: number, playlistId?: string) => void;

    addSong: (song: Song) => void;
    removeSong: (songId: string) => void;

    prev: () => void;
    next: () => void;
    move: (from: number, to: number) => void;
}

const usePlayer = create<PlayerStore>((set) => ({
    songs: [],
    playingSong: undefined,
    path: undefined,
    playlistId: undefined,

    setPath: (path?: string) => set({ path }),

    setPlayer: (songs: Song[], index: number, playlistId?: string) =>
        set({
            songs: [...songs],
            playingSong: songs[index],
            playlistId,
        }),

    addSong: (song: Song) =>
        set((state) => {
            state.songs.push(song);

            return {
                songs: state.songs,
            };
        }),
    removeSong: (songId: string) =>
        set((state) => {
            const idx = state.songs.findIndex(s => s.id === songId);

            if (idx >= 0) state.songs.splice(idx, 1);

            return {
                songs: state.songs,
            };
        }),

    prev: () =>
        set((state) => {
            if (!state.songs[0]) {
                return state;
            }

            const length = state.songs.length;
            const currentIndex = state.songs.findIndex(
                (s) => s.id == state.playingSong?.id,
            );
            const prevIndex = currentIndex <= 0 ? length - 1 : currentIndex - 1;

            return {
                playingSong: state.songs[prevIndex],
            };
        }),
    next: () =>
        set((state) => {
            if (!state.songs[0]) {
                return state;
            }

            const length = state.songs.length;
            const currentIndex = state.songs.findIndex(
                (s) => s.id == state.playingSong?.id,
            );
            const nextIndex = currentIndex >= length - 1 ? 0 : currentIndex + 1;

            return {
                playingSong: state.songs[nextIndex],
            };
        }),

    move: (from: number, to: number) =>
        set((state) => {
            const [removed] = state.songs.splice(from, 1);
            state.songs.splice(to, 0, removed);

            return {
                songs: state.songs,
            };
        }),
}));

export default usePlayer;
