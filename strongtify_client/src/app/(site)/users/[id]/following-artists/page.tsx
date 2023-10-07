"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import { getFollowingArtists } from "@/services/api/users";
import SiteLoading from "@/app/(site)/loading";
import { Artist } from "@/types/artist";
import ArtistSection from "@/components/artists/ArtistSection";

export default function FollowingUsersPage({
    params,
}: {
    params: { id: string };
}) {
    const [end, setEnd] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [artists, setArtists] = useState<Artist[]>();

    useEffect(() => {
        const get = async () => {
            const data = await getFollowingArtists(params.id, {
                skip: 0,
                take: 20,
            });

            setArtists(data?.results);
            setSkip(0);
            setEnd(data?.end ?? true);
            setIsLoading(false);
        };

        get();
    }, []);

    const fetchMoreArtists = async () => {
        const data = await getFollowingArtists(params.id, {
            skip: skip + 20,
            take: 20,
        });

        setArtists([...(artists ?? []), ...(data?.results ?? [])]);
        setSkip(skip + 20);
        setEnd(data?.end ?? true);
    };

    return (
        <main className="py-5">
            <h2 className="text-yellow-50 text-2xl mb-5 font-medium">
                Nghệ sĩ đang theo dõi
            </h2>

            {isLoading && <SiteLoading />}

            {!isLoading && (
                <InfiniteScroll
                    dataLength={skip + 20}
                    next={fetchMoreArtists}
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
        </main>
    );
}
