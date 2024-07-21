"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import { Album } from "@/types/album";
import AlbumSection from "@/components/albums/AlbumSection";
import { getLikedAlbums } from "@/services/api/me";
import PlaylistSectionLoading from "@/components/loadings/PlaylistLoadingSection";
import HomeLoading from "../../(home)/loading";

export default function LikedAlbumsPage() {
    const [end, setEnd] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [albums, setAlbums] = useState<Album[]>();

    const { data: session, status } = useSession();

    useEffect(() => {
        const get = async () => {
            const data = await getLikedAlbums(session?.accessToken ?? "", {
                skip: 0,
                take: 20,
            });

            setAlbums(data?.results);
            setSkip(0);
            setEnd(data?.end ?? true);
            setIsLoading(false);
        };

        if (status !== "loading") get();
    }, [status]);

    const fetchMoreAlbums = async () => {
        const data = await getLikedAlbums(session?.accessToken ?? "", {
            skip: skip + 20,
            take: 20,
        });

        setAlbums([...(albums ?? []), ...(data?.results ?? [])]);
        setSkip(skip + 20);
        setEnd(data?.end ?? true);
    };

    if (status === "loading") {
        return <HomeLoading />;
    }

    return (
        <main className="py-5">
            <h2 className="text-yellow-50 text-2xl mb-5 font-medium">
                Album đã thích
            </h2>

            {isLoading && <PlaylistSectionLoading count={20} />}

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
