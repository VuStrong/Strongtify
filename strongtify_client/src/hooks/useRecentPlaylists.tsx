import { Playlist } from "@/types/playlist";
import { create } from "zustand";

interface RecentPlaylistStore {
    isLoading: boolean;
    playlists: Playlist[];

    setIsLoading: (isLoading: boolean) => void;
    setPlaylists: (playlists: Playlist[]) => void;
    addPlaylist: (playlist: Playlist) => void;
    removePlaylist: (playlistId: string) => void;
}

const useRecentPlaylists = create<RecentPlaylistStore>((set) => ({
    isLoading: false,
    playlists: [],

    setIsLoading: (isLoading: boolean) => set({isLoading}),

    setPlaylists: (playlists: Playlist[]) => set({ playlists }),

    addPlaylist: (playlist: Playlist) => set(state => ({
        playlists: [...state.playlists, playlist]
    })),

    removePlaylist: (playlistId: string) => set(state => {
        return {
            playlists: state.playlists.filter(p => p.id !== playlistId),
        }
    }),
}));

export default useRecentPlaylists;