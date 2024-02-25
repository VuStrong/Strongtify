"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import SearchForm from "@/components/SearchForm";
import SearchItemLinkList from "@/components/SearchItemLinkList";
import AlbumSection from "@/components/albums/AlbumSection";
import { Album } from "@/types/album";
import HomeLoading from "@/app/(site)/(home)/loading";
import { getAlbums } from "@/services/api/albums";
import PlaylistSectionLoading from "@/components/loadings/PlaylistLoadingSection";

export default function SearchAlbumPage({
    params,
}: {
    params: { value: string };
}) {
    const [end, setEnd] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(0);
    const [isSearching, setIsSearching] = useState<boolean>(true);
    const [albums, setAlbums] = useState<Album[]>();

    useEffect(() => {
        const search = async () => {
            const data = await getAlbums({
                skip: 0,
                take: 20,
                q: decodeURIComponent(params.value),
                sort: "likeCount_desc",
            });

            setAlbums(data?.results);
            setSkip(0);
            setEnd(data?.end ?? true);
            setIsSearching(false);
        };

        search();
    }, []);

    const fetchMoreAlbum = async () => {
        const data = await getAlbums({
            skip: skip + 20,
            take: 20,
            q: decodeURIComponent(params.value),
            sort: "likeCount_desc",
        });

        setAlbums([...(albums ?? []), ...(data?.results ?? [])]);
        setSkip(skip + 20);
        setEnd(data?.end ?? true);
    };

    return (
        <main>
            <SearchForm
                value={decodeURIComponent(params.value)}
                searchItem="albums"
            />

            <div className="flex flex-col gap-10">
                <SearchItemLinkList
                    activeLink="albums"
                    searchValue={decodeURIComponent(params.value)}
                />

                {isSearching && <PlaylistSectionLoading count={20} />}

                {!isSearching && (
                    <InfiniteScroll
                        dataLength={skip + 20}
                        next={fetchMoreAlbum}
                        hasMore={!end}
                        loader={
                            <div className="flex justify-center">
                                <BeatLoader color="#f58c1b" />
                            </div>
                        }
                    >
                        <AlbumSection albums={albums ?? []} />
                    </InfiniteScroll>
                )}
            </div>
        </main>
    );
}
