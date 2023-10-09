"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import { getPlaylists } from "@/services/api/playlists";
import { Playlist } from "@/types/playlist";

export default function PlaylistContent({
    onClickPlaylist,
}: {
    onClickPlaylist: (playlistId: string) => Promise<void>;
}) {
    const [end, setEnd] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(0);
    const [playlists, setPlaylists] = useState<Playlist[]>();
    const { data: session } = useSession();

    useEffect(() => {
        const fetchPlaylists = async () => {
            const data = await getPlaylists(
                {
                    skip: 0,
                    take: 10,
                    sort: "createdAt_desc",
                    userId: session?.user.id,
                },
                session?.accessToken,
            );

            setPlaylists(data?.results);
            setSkip(0);
            setEnd(data?.end ?? true);
        };

        if (session?.accessToken) fetchPlaylists();
    }, [session?.accessToken]);

    const fetchMorePlaylists = async () => {
        const data = await getPlaylists(
            {
                skip: skip + 10,
                take: 10,
                sort: "createdAt_desc",
                userId: session?.user.id,
            },
            session?.accessToken,
        );

        setPlaylists([...(playlists ?? []), ...(data?.results ?? [])]);
        setSkip(skip + 10);
        setEnd(data?.end ?? true);
    };

    return (
        <div className="px-4 py-3 sm:px-6">
            <h3 className="font-semibold leading-6 text-primary text-xl mb-2">
                Thêm vào playlist
            </h3>

            <div
                className="overflow-y-auto max-h-[300px] my-3"
                id="scrollablePlaylist"
            >
                <InfiniteScroll
                    dataLength={skip + 10}
                    next={fetchMorePlaylists}
                    hasMore={!end}
                    loader={
                        <div className="flex justify-center">
                            <BeatLoader color="#f58c1b" />
                        </div>
                    }
                    scrollableTarget="scrollablePlaylist"
                >
                    {playlists?.map((playlist) => (
                        <div
                            key={playlist.id}
                            className="py-2 px-4 hover:bg-darkgray cursor-pointer text-yellow-50"
                            onClick={() => {
                                onClickPlaylist(playlist.id);
                            }}
                        >
                            {playlist.name}
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
        </div>
    );
}
