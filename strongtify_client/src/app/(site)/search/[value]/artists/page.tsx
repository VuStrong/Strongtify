"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import SearchForm from "@/components/SearchForm";
import SearchItemLinkList from "@/components/SearchItemLinkList";
import ArtistSection from "@/components/artists/ArtistSection";
import { Artist } from "@/types/artist";
import HomeLoading from "@/app/(site)/(home)/loading";
import { getArtists } from "@/services/api/artists";
import UserSectionLoading from "@/components/loadings/UserSectionLoading";

export default function SearchArtistPage({
    params,
}: {
    params: { value: string };
}) {
    const [end, setEnd] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(0);
    const [isSearching, setIsSearching] = useState<boolean>(true);
    const [artists, setArtists] = useState<Artist[]>();

    useEffect(() => {
        const search = async () => {
            const data = await getArtists({
                skip: 0,
                take: 20,
                q: decodeURIComponent(params.value),
                sort: "followerCount_desc"
            });

            setArtists(data?.results);
            setSkip(0);
            setEnd(data?.end ?? true);
            setIsSearching(false);
        };

        search();
    }, []);

    const fetchMoreArtist = async () => {
        const data = await getArtists({
            skip: skip + 20,
            take: 20,
            q: decodeURIComponent(params.value),
            sort: "followerCount_desc"
        });

        setArtists([...(artists ?? []), ...(data?.results ?? [])]);
        setSkip(skip + 20);
        setEnd(data?.end ?? true);
    };

    return (
        <main>
            <SearchForm value={decodeURIComponent(params.value)} searchItem="artists" />

            <div className="flex flex-col gap-10">
                <SearchItemLinkList
                    activeLink="artists"
                    searchValue={decodeURIComponent(params.value)}
                />

                {isSearching && <UserSectionLoading count={20} />}

                {!isSearching && (
                    <InfiniteScroll
                        dataLength={skip + 20}
                        next={fetchMoreArtist}
                        hasMore={!end}
                        loader={
                            <div className="flex justify-center">
                                <BeatLoader color="#f58c1b" />
                            </div>
                        }
                    >
                        <ArtistSection artists={artists ?? []} />
                    </InfiniteScroll>
                )}
            </div>
        </main>
    );
}
