"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import { getFollowers } from "@/services/api/users";
import UserSection from "@/components/users/UserSection";
import { User } from "@/types/user";
import HomeLoading from "@/app/(site)/(home)/loading";
import UserSectionLoading from "@/components/loadings/UserSectionLoading";

export default function UserFollowersPage({
    params,
}: {
    params: { id: string };
}) {
    const [end, setEnd] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [followers, setFollowers] = useState<User[]>();

    useEffect(() => {
        const get = async () => {
            const data = await getFollowers(params.id, {
                skip: 0,
                take: 20,
            });

            setFollowers(data?.results);
            setSkip(0);
            setEnd(data?.end ?? true);
            setIsLoading(false);
        };

        get();
    }, []);

    const fetchMoreFollowers = async () => {
        const data = await getFollowers(params.id, {
            skip: skip + 20,
            take: 20,
        });

        setFollowers([...(followers ?? []), ...(data?.results ?? [])]);
        setSkip(skip + 20);
        setEnd(data?.end ?? true);
    };

    return (
        <main className="py-5">
            <h2 className="text-yellow-50 text-2xl mb-5 font-medium">
                Người theo dõi
            </h2>

            {isLoading && <UserSectionLoading count={20} />}

            {!isLoading && (
                <InfiniteScroll
                    dataLength={skip + 20}
                    next={fetchMoreFollowers}
                    hasMore={!end}
                    loader={
                        <div className="flex justify-center">
                            <BeatLoader color="#f58c1b" />
                        </div>
                    }
                >
                    <UserSection users={followers ?? []} />
                </InfiniteScroll>
            )}
        </main>
    );
}
