"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import { Song } from "@/types/song";
import SongSection from "@/components/songs/SongSection";
import { getLikedSongs } from "@/services/api/me";
import SongSectionLoading from "@/components/loadings/SongSectionLoading";
import HomeLoading from "../../(home)/loading";

export default function LikedSongsPage() {
    const [end, setEnd] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [songs, setSongs] = useState<Song[]>();

    const { data: session, status } = useSession();

    useEffect(() => {
        const get = async () => {
            const data = await getLikedSongs(session?.accessToken ?? "", {
                skip: 0,
                take: 20,
            });

            setSongs(data?.results);
            setSkip(0);
            setEnd(data?.end ?? true);
            setIsLoading(false);
        };

        if (status !== "loading") get();
    }, [status]);

    const fetchMoreSongs = async () => {
        const data = await getLikedSongs(session?.accessToken ?? "", {
            skip: skip + 20,
            take: 20,
        });

        setSongs([...(songs ?? []), ...(data?.results ?? [])]);
        setSkip(skip + 20);
        setEnd(data?.end ?? true);
    };

    if (status === "loading") {
        return <HomeLoading />;
    }

    return (
        <main className="py-5">
            <h2 className="text-yellow-50 text-2xl mb-5 font-medium">
                Bài hát đã thích
            </h2>

            {isLoading && <SongSectionLoading count={20} oneColumn />}

            {!isLoading && (
                <InfiniteScroll
                    dataLength={skip + 20}
                    next={fetchMoreSongs}
                    hasMore={!end}
                    loader={
                        <div className="flex justify-center">
                            <BeatLoader color="#f58c1b" />
                        </div>
                    }
                >
                    <SongSection songs={songs ?? []} oneColumn />
                </InfiniteScroll>
            )}
        </main>
    );
}
