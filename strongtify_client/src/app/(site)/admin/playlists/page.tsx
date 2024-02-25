"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";

import TableItem from "@/components/admin/tables/TableItem";
import { DEFAULT_AVATAR_URL, NO_IMAGE_URL } from "@/libs/constants";
import { User } from "@/types/user";
import { getPlaylists } from "@/services/api/playlists";
import Skeleton from "react-loading-skeleton";

const playlistColumns = [
    {
        name: "imageUrl",
        displayName: "#",
        render: (data: any) => (
            <Image
                src={data ?? NO_IMAGE_URL}
                style={{ width: "50px", height: "auto" }}
                width={50}
                height={50}
                alt="playlist"
            />
        ),
    },
    {
        name: "name",
        displayName: "Name",
    },
    {
        name: "user",
        displayName: "User",
        render: (data: User) => (
            <div className="px-4 py-2 flex gap-2">
                <Image
                    className="rounded-full"
                    width={24}
                    height={24}
                    src={data?.imageUrl ?? DEFAULT_AVATAR_URL}
                    alt={data.name}
                />
                <div className="text-gray-500 text-base truncate hover:underline">
                    {data.name}
                </div>
            </div>
        ),
    },
    {
        name: "songCount",
        displayName: "Song Count",
    },
    {
        name: "likeCount",
        displayName: "Like Count",
    },
];

export default function AdminSongsPage() {
    const { data: session } = useSession();

    return (
        <section className="mb-5">
            <h1 className="text-primary text-4xl mb-7">Playlists</h1>

            {session?.user ? (
                <TableItem
                    itemName="Playlist"
                    readonly
                    columns={playlistColumns}
                    generateItemLink={(item) => `/admin/playlists/${item.id}`}
                    itemPerPage={10}
                    onLoadItems={(page, size) =>
                        getPlaylists(
                            {
                                skip: (page - 1) * size,
                                take: size,
                                sort: "updatedAt_desc",
                            },
                            session.accessToken,
                        )
                    }
                    onSearchItems={(value, page, size) =>
                        getPlaylists(
                            {
                                skip: (page - 1) * size,
                                take: size,
                                sort: "updatedAt_desc",
                                q: value,
                            },
                            session.accessToken,
                        )
                    }
                />
            ) : (
                <div className="w-full">
                    <Skeleton
                        count={10}
                        highlightColor="#f58c1b"
                        baseColor="#121212"
                    />
                </div>
            )}
        </section>
    );
}
