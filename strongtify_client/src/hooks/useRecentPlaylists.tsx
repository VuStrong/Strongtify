import { getPlaylists } from "@/services/api/playlists";
import { Playlist } from "@/types/playlist";
import { getSession } from "next-auth/react";
import { create } from "zustand";

interface RecentPlaylistStore {
    isLoading: boolean;
    playlists: Playlist[];

    setIsLoading: (isLoading: boolean) => void;
    setPlaylists: (playlists: Playlist[]) => void;
    addPlaylist: (playlist: Playlist) => void;
    removePlaylist: (playlistId: string) => void;

    fetchRecentPlaylists: () => Promise<void>;
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

    fetchRecentPlaylists: async () => {
        set({ isLoading: true });

        const session = await getSession();

        const data = await getPlaylists(
            {
                skip: 0,
                take: 5,
                sort: "createdAt_desc",
                userId: session?.user.id,
            },
            session?.accessToken,
        );

        set({ 
            playlists: data?.results ?? [], 
            isLoading: false, 
        });
    },
}));

export default useRecentPlaylists;