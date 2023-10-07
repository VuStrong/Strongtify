"use client";

import type { Metadata } from "next";
import Image from "next/image";

import TableItem from "@/components/admin/tables/TableItem";
import { getSongs, searchSongs } from "@/services/api/songs";
import { NO_IMAGE_URL } from "@/libs/constants";

export const metadata: Metadata = {
    title: "Quản lý Songs",
};

const songColumns = [
    {
        name: "imageUrl",
        displayName: "#",
        render: (data: any) => (
            <Image
                src={data ?? NO_IMAGE_URL}
                style={{ width: "50px", height: "auto" }}
                width={50}
                height={50}
                alt="song"
            />
        ),
    },
    {
        name: "name",
        displayName: "Name",
    },
    {
        name: "artists",
        displayName: "Artists",
        render: (data: any) => (
            <div className="px-4 py-2">
                {data?.map((i: any) => i.name).join(", ")}
            </div>
        ),
    },
    {
        name: "language",
        displayName: "Language",
    },
    {
        name: "likeCount",
        displayName: "Like Count",
    },
];

export default function AdminSongsPage() {
    return (
        <section className="mb-5">
            <h1 className="text-primary text-4xl mb-7">Songs</h1>

            <TableItem
                itemName="Song"
                columns={songColumns}
                createItemLink="/admin/songs/create"
                onClickItem={(item) => `/admin/songs/${item.id}`}
                itemPerPage={10}
                onLoadItems={(page, size) =>
                    getSongs({
                        skip: (page - 1) * size,
                        take: size,
                        sort: "createdAt_desc",
                    })
                }
                onSearchItems={(value, page, size) =>
                    searchSongs(value, {
                        skip: (page - 1) * size,
                        take: size,
                    })
                }
            />
        </section>
    );
}
