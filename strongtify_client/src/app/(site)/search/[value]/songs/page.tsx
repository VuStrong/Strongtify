"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import SearchForm from "@/components/SearchForm";
import SearchItemLinkList from "@/components/SearchItemLinkList";
import { searchSongs } from "@/services/api/songs";
import SongSection from "@/components/songs/SongSection";
import { Song } from "@/types/song";
import SiteLoading from "@/app/(site)/loading";

export default function SearchSongPage({
    params,
}: {
    params: { value: string };
}) {
    const [end, setEnd] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(0);
    const [isSearching, setIsSearching] = useState<boolean>(true);
    const [songs, setSongs] = useState<Song[]>();

    useEffect(() => {
        const search = async () => {
            const data = await searchSongs(params.value, {
                skip: 0,
                take: 20,
            });

            setSongs(data?.results);
            setSkip(0);
            setEnd(data?.end ?? true);
            setIsSearching(false);
        };

        search();
    }, []);

    const fetchMoreSong = async () => {
        const data = await searchSongs(params.value, {
            skip: skip + 20,
            take: 20,
        });

        setSongs([...(songs ?? []), ...(data?.results ?? [])]);
        setSkip(skip + 20);
        setEnd(data?.end ?? true);
    };

    return (
        <main>
            <SearchForm value={params.value} searchItem="songs" />

            <div className="flex flex-col gap-10">
                <SearchItemLinkList
                    activeLink="songs"
                    searchValue={params.value}
                />

                {isSearching && <SiteLoading />}

                {!isSearching && (
                    <InfiniteScroll
                        dataLength={skip + 20}
                        next={fetchMoreSong}
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
            </div>
        </main>
    );
}
