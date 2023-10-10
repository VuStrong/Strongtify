"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import SiteLoading from "@/app/(site)/loading";
import { Album } from "@/types/album";
import { getAlbums } from "@/services/api/albums";
import AlbumSection from "@/components/albums/AlbumSection";

export default function GenreAlbumsPage({
    params,
}: {
    params: { id: string; alias: string };
}) {
    const [end, setEnd] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [albums, setAlbums] = useState<Album[]>();

    useEffect(() => {
        const get = async () => {
            const data = await getAlbums({
                skip: 0,
                take: 20,
                sort: "likeCount_desc",
                genreId: params.id,
            });

            setAlbums(data?.results);
            setSkip(0);
            setEnd(data?.end ?? true);
            setIsLoading(false);
        };

        get();
    }, []);

    const fetchMoreAlbums = async () => {
        const data = await getAlbums({
            skip: skip + 20,
            take: 20,
            sort: "likeCount_desc",
            genreId: params.id,
        });

        setAlbums([...(albums ?? []), ...(data?.results ?? [])]);
        setSkip(skip + 20);
        setEnd(data?.end ?? true);
    };

    return (
        <main className="py-5">
            <h2 className="text-yellow-50 text-2xl mb-5 font-medium">Album</h2>

            {isLoading && <SiteLoading />}

            {!isLoading && (
                <InfiniteScroll
                    dataLength={skip + 20}
                    next={fetchMoreAlbums}
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
        </main>
    );
}
