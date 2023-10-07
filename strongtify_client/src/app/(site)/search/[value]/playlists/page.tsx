"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import SearchForm from "@/components/SearchForm";
import SearchItemLinkList from "@/components/SearchItemLinkList";
import { searchPlaylists } from "@/services/api/playlists";
import PlaylistSection from "@/components/playlists/PlaylistSection";
import { Playlist } from "@/types/playlist";
import SiteLoading from "@/app/(site)/loading";

export default function SearchPlaylistPage({
    params,
}: {
    params: { value: string };
}) {
    const [end, setEnd] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(0);
    const [isSearching, setIsSearching] = useState<boolean>(true);
    const [playlists, setPlaylists] = useState<Playlist[]>();

    useEffect(() => {
        const search = async () => {
            const data = await searchPlaylists(params.value, {
                skip: 0,
                take: 20,
            });

            setPlaylists(data?.results);
            setSkip(0);
            setEnd(data?.end ?? true);
            setIsSearching(false);
        };

        search();
    }, []);

    const fetchMorePlaylists = async () => {
        const data = await searchPlaylists(params.value, {
            skip: skip + 20,
            take: 20,
        });

        setPlaylists([...(playlists ?? []), ...(data?.results ?? [])]);
        setSkip(skip + 20);
        setEnd(data?.end ?? true);
    };

    return (
        <main>
            <SearchForm value={params.value} searchItem="playlists" />

            <div className="flex flex-col gap-10">
                <SearchItemLinkList
                    activeLink="playlists"
                    searchValue={params.value}
                />

                {isSearching && <SiteLoading />}

                {!isSearching && (
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
            </div>
        </main>
    );
}
