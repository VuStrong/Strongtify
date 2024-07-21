"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import { getFollowingUsers } from "@/services/api/users";
import UserSection from "@/components/users/UserSection";
import { User } from "@/types/user";
import UserSectionLoading from "@/components/loadings/UserSectionLoading";

export default function FollowingUsersPage({
    params,
}: {
    params: { id: string };
}) {
    const [end, setEnd] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<User[]>();

    useEffect(() => {
        const get = async () => {
            const data = await getFollowingUsers(params.id, {
                skip: 0,
                take: 20,
            });

            setUsers(data?.results);
            setSkip(0);
            setEnd(data?.end ?? true);
            setIsLoading(false);
        };

        get();
    }, []);

    const fetchMoreFollowingUsers = async () => {
        const data = await getFollowingUsers(params.id, {
            skip: skip + 20,
            take: 20,
        });

        setUsers([...(users ?? []), ...(data?.results ?? [])]);
        setSkip(skip + 20);
        setEnd(data?.end ?? true);
    };

    return (
        <main className="py-5">
            <h2 className="text-yellow-50 text-2xl mb-5 font-medium">
                Đang theo dõi
            </h2>

            {isLoading && <UserSectionLoading count={20} />}

            {!isLoading && (
                <InfiniteScroll
                    dataLength={skip + 20}
                    next={fetchMoreFollowingUsers}
                    hasMore={!end}
                    loader={
                        <div className="flex justify-center">
                            <BeatLoader color="#f58c1b" />
                        </div>
                    }
                >
                    <UserSection users={users ?? []} />
                </InfiniteScroll>
            )}
        </main>
    );
}
