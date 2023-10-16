"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import PlaylistSection from "@/components/playlists/PlaylistSection";
import { Playlist } from "@/types/playlist";
import HomeLoading from "@/app/(site)/(home)/loading";
import { getLikedPlaylists } from "@/services/api/me";
import PlaylistSectionLoading from "@/components/loadings/PlaylistLoadingSection";

export default function LikedPlaylistsPage() {
    const [end, setEnd] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [playlists, setPlaylists] = useState<Playlist[]>();

    const { data: session, status } = useSession();

    if (status === "loading") {
        return <HomeLoading />;
    }

    useEffect(() => {
        const get = async () => {
            const data = await getLikedPlaylists(session?.accessToken ?? "", {
                skip: 0,
                take: 20,
            });

            setPlaylists(data?.results);
            setSkip(0);
            setEnd(data?.end ?? true);
            setIsLoading(false);
        };

        get();
    }, []);

    const fetchMorePlaylists = async () => {
        const data = await getLikedPlaylists(session?.accessToken ?? "", {
            skip: skip + 20,
            take: 20,
        });

        setPlaylists([...(playlists ?? []), ...(data?.results ?? [])]);
        setSkip(skip + 20);
        setEnd(data?.end ?? true);
    };

    return (
        <main className="py-5">
            <h2 className="text-yellow-50 text-2xl mb-5 font-medium">
                Playlist đã thích
            </h2>

            {isLoading && <PlaylistSectionLoading count={20} />}

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
