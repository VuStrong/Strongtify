"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import { Song } from "@/types/song";
import { getSongs } from "@/services/api/songs";
import SongSection from "@/components/songs/SongSection";
import SongSectionLoading from "@/components/loadings/SongSectionLoading";

export default function GenreSongsPage({
    params,
}: {
    params: { id: string; alias: string };
}) {
    const [end, setEnd] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [songs, setSongs] = useState<Song[]>();

    useEffect(() => {
        const get = async () => {
            const data = await getSongs({
                skip: 0,
                take: 20,
                sort: "listenCount_desc",
                genreId: params.id,
            });

            setSongs(data?.results);
            setSkip(0);
            setEnd(data?.end ?? true);
            setIsLoading(false);
        };

        get();
    }, []);

    const fetchMoreSongs = async () => {
        const data = await getSongs({
            skip: skip + 20,
            take: 20,
            sort: "listenCount_desc",
            genreId: params.id,
        });

        setSongs([...(songs ?? []), ...(data?.results ?? [])]);
        setSkip(skip + 20);
        setEnd(data?.end ?? true);
    };

    return (
        <main className="py-5">
            <h2 className="text-yellow-50 text-2xl mb-5 font-medium">
                Bài hát
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
