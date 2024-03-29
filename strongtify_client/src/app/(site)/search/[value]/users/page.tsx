"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BeatLoader } from "react-spinners";
import SearchForm from "@/components/SearchForm";
import SearchItemLinkList from "@/components/SearchItemLinkList";
import { getUsers } from "@/services/api/users";
import UserSection from "@/components/users/UserSection";
import { User } from "@/types/user";
import UserSectionLoading from "@/components/loadings/UserSectionLoading";

export default function SearchUserPage({
    params,
}: {
    params: { value: string };
}) {
    const [end, setEnd] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(0);
    const [isSearching, setIsSearching] = useState<boolean>(true);
    const [users, setUsers] = useState<User[]>();

    useEffect(() => {
        const search = async () => {
            const data = await getUsers({
                skip: 0,
                take: 20,
                q: decodeURIComponent(params.value),
            });

            setUsers(data?.results);
            setSkip(0);
            setEnd(data?.end ?? true);
            setIsSearching(false);
        };

        search();
    }, []);

    const fetchMoreUsers = async () => {
        const data = await getUsers({
            skip: skip + 20,
            take: 20,
            q: decodeURIComponent(params.value),
            sort: "followerCount_desc",
        });

        setUsers([...(users ?? []), ...(data?.results ?? [])]);
        setSkip(skip + 20);
        setEnd(data?.end ?? true);
    };

    return (
        <main>
            <SearchForm
                value={decodeURIComponent(params.value)}
                searchItem="users"
            />

            <div className="flex flex-col gap-10">
                <SearchItemLinkList
                    activeLink="users"
                    searchValue={decodeURIComponent(params.value)}
                />

                {isSearching && <UserSectionLoading count={20} />}

                {!isSearching && (
                    <InfiniteScroll
                        dataLength={skip + 20}
                        next={fetchMoreUsers}
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
            </div>
        </main>
    );
}
