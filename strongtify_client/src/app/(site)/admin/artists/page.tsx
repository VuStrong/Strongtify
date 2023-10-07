"use client";

import type { Metadata } from "next";
import Image from "next/image";

import TableItem from "@/components/admin/tables/TableItem";
import { getArtists, searchArtists } from "@/services/api/artists";
import { DEFAULT_AVATAR_URL } from "@/libs/constants";

export const metadata: Metadata = {
    title: "Quản lý Artists",
};

const artistColumns = [
    {
        name: "imageUrl",
        displayName: "#",
        render: (data: any) => (
            <Image
                src={data ?? DEFAULT_AVATAR_URL}
                style={{ width: "50px", height: "auto" }}
                width={50}
                height={50}
                alt="artist"
            />
        ),
    },
    {
        name: "name",
        displayName: "Name",
    },
    {
        name: "followerCount",
        displayName: "Follower Count",
    },
];

export default function AdminArtistsPage() {
    return (
        <section className="mb-5">
            <h1 className="text-primary text-4xl mb-7">Artists</h1>

            <TableItem
                itemName="Artist"
                columns={artistColumns}
                createItemLink="/admin/artists/create"
                onClickItem={(item) => `/admin/artists/${item.id}`}
                itemPerPage={10}
                onLoadItems={(page, size) =>
                    getArtists({
                        skip: (page - 1) * size,
                        take: size,
                        sort: "createdAt_desc",
                    })
                }
                onSearchItems={(value, page, size) =>
                    searchArtists(value, {
                        skip: (page - 1) * size,
                        take: size,
                    })
                }
            />
        </section>
    );
}