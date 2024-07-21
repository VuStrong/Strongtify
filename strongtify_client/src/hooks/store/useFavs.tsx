import { create } from "zustand";

interface FavsStore {
    isLoading: boolean;

    likedSongIds: Set<string>;
    likedAlbumIds: Set<string>;
    likedPlaylistIds: Set<string>;
    followingArtistIds: Set<string>;
    followingUserIds: Set<string>;

    setIsLoading: (isLoading: boolean) => void;

    setLikedSongIds: (songIds: string[]) => void;
    addLikedSongId: (songId: string) => void;
    removeLikedSongId: (songId: string) => void;

    setLikedAlbumIds: (albumIds: string[]) => void;
    addLikedAlbumId: (albumId: string) => void;
    removeLikedAlbumId: (albumId: string) => void;

    setLikedPlaylistIds: (playlistIds: string[]) => void;
    addLikedPlaylistId: (playlistId: string) => void;
    removeLikedPlaylistId: (playlistId: string) => void;

    setFollowingArtistIds: (artistIds: string[]) => void;
    addFollowingArtistId: (artistId: string) => void;
    removeFollowingArtistId: (artistId: string) => void;

    setFollowingUserIds: (userIds: string[]) => void;
    addFollowingUserId: (userId: string) => void;
    removeFollowingUserId: (userId: string) => void;
}

const useFavs = create<FavsStore>((set) => ({
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),

    likedSongIds: new Set<string>(),
    likedAlbumIds: new Set<string>(),
    likedPlaylistIds: new Set<string>(),
    followingArtistIds: new Set<string>(),
    followingUserIds: new Set<string>(),

    setLikedSongIds: (songIds: string[]) =>
        set({ likedSongIds: new Set(songIds) }),

    addLikedSongId: (songId: string) =>
        set((state) => ({
            likedSongIds: state.likedSongIds.add(songId),
        })),

    removeLikedSongId: (songId: string) =>
        set((state) => {
            state.likedSongIds.delete(songId);

            return { likedSongIds: state.likedSongIds };
        }),

    setLikedAlbumIds: (albumIds: string[]) =>
        set({ likedAlbumIds: new Set(albumIds) }),

    addLikedAlbumId: (albumId: string) =>
        set((state) => ({
            likedAlbumIds: state.likedAlbumIds.add(albumId),
        })),

    removeLikedAlbumId: (albumId: string) =>
        set((state) => {
            state.likedAlbumIds.delete(albumId);

            return { likedAlbumIds: state.likedAlbumIds };
        }),

    setLikedPlaylistIds: (playlistIds: string[]) =>
        set({ likedPlaylistIds: new Set(playlistIds) }),

    addLikedPlaylistId: (playlistId: string) =>
        set((state) => ({
            likedPlaylistIds: state.likedPlaylistIds.add(playlistId),
        })),

    removeLikedPlaylistId: (playlistId: string) =>
        set((state) => {
            state.likedPlaylistIds.delete(playlistId);

            return { likedPlaylistIds: state.likedPlaylistIds };
        }),

    setFollowingArtistIds: (artistIds: string[]) =>
        set({ followingArtistIds: new Set(artistIds) }),

    addFollowingArtistId: (artistId: string) =>
        set((state) => ({
            followingArtistIds: state.followingArtistIds.add(artistId),
        })),

    removeFollowingArtistId: (artistId: string) =>
        set((state) => {
            state.followingArtistIds.delete(artistId);

            return { followingArtistIds: state.followingArtistIds };
        }),

    setFollowingUserIds: (userIds: string[]) =>
        set({ followingUserIds: new Set(userIds) }),

    addFollowingUserId: (userId: string) =>
        set((state) => ({
            followingUserIds: state.followingUserIds.add(userId),
        })),

    removeFollowingUserId: (userId: string) =>
        set((state) => {
            state.followingUserIds.delete(userId);

            return { followingUserIds: state.followingUserIds };
        }),
}));

export default useFavs;
