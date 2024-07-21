"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import { getPlaylists } from "@/services/api/playlists";
import PlaylistSection from "@/components/playlists/PlaylistSection";
import { Playlist } from "@/types/playlist";
import PlaylistSectionLoading from "@/components/loadings/PlaylistLoadingSection";

export default function UserPlaylistsPage({
    params,
}: {
    params: { id: string };
}) {
    const [end, setEnd] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [playlists, setPlaylists] = useState<Playlist[]>();
    const { data: session, status } = useSession();

    useEffect(() => {
        const get = async () => {
            const data = await getPlaylists(
                {
                    skip: 0,
                    take: 20,
                    sort: "createdAt_desc",
                    userId: params.id,
                },
                session?.accessToken,
            );

            setPlaylists(data?.results);
            setSkip(0);
            setEnd(data?.end ?? true);
            setIsLoading(false);
        };

        if (status !== "loading") get();
    }, [status]);

    const fetchMorePlaylists = async () => {
        const data = await getPlaylists(
            {
                skip: skip + 20,
                take: 20,
                sort: "createdAt_desc",
                userId: params.id,
            },
            session?.accessToken,
        );

        setPlaylists([...(playlists ?? []), ...(data?.results ?? [])]);
        setSkip(skip + 20);
        setEnd(data?.end ?? true);
    };

    return (
        <main className="py-5">
            <h2 className="text-yellow-50 text-2xl mb-5 font-medium">
                Playlist
            </h2>

            {(isLoading || status === "loading") && (
                <PlaylistSectionLoading count={20} />
            )}

            {!isLoading && (
                <InfiniteScroll
                    dataLength={skip + 20}
                    next={fetchMorePlaylists}
                    hasMore={!end}
                    loader={
                        <div className="flex justify-center">
                            <BeatLoader color="#f58c1b" />
                        </div>
                    }
                >
                    <PlaylistSection playlists={playlists ?? []} />
                </InfiniteScroll>
            )}
        </main>
    );
}
