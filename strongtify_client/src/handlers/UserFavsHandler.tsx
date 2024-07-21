"use client";

import useFavs from "@/hooks/store/useFavs";
import { getFavs } from "@/services/api/me";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const UserFavsHandler = () => {
    const { data: session } = useSession();
    const favs = useFavs();

    useEffect(() => {
        if (session) {
            const getFavsFunc = async () => {
                favs.setIsLoading(true);

                const data = await getFavs(session.accessToken);

                if (!data) return;

                favs.setLikedSongIds(data.songIds);
                favs.setLikedAlbumIds(data.albumIds);
                favs.setLikedPlaylistIds(data.playlistIds);
                favs.setFollowingArtistIds(data.artistIds);
                favs.setFollowingUserIds(data.userIds);
                favs.setIsLoading(false);
            };

            getFavsFunc();
        }
    }, [session?.accessToken]);

    return null;
};

export default UserFavsHandler;
