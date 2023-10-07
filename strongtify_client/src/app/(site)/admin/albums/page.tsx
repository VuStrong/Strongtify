"use client";

import type { Metadata } from "next";
import Image from "next/image";

import TableItem from "@/components/admin/tables/TableItem";
import { getAlbums, searchAlbums } from "@/services/api/albums";
import { NO_IMAGE_URL } from "@/libs/constants";

export const metadata: Metadata = {
    title: "Quản lý Albums",
};

const albumColumns = [
    {
        name: "imageUrl",
        displayName: "#",
        render: (data: any) => (
            <Image
                src={data ?? NO_IMAGE_URL}
                style={{ width: "50px", height: "auto" }}
                width={50}
                height={50}
                alt="album"
            />
        ),
    },
    {
        name: "name",
        displayName: "Name",
    },
    {
        name: "artist",
        displayName: "Artist",
        render: (data: any) => <div className="px-4 py-2">{data?.name}</div>,
    },
    {
        name: "likeCount",
        displayName: "Like Count",
    },
];

export default function AdminAlbumsPage() {
    return (
        <section className="mb-5">
            <h1 className="text-primary text-4xl mb-7">Albums</h1>

            <TableItem
                itemName="Album"
                columns={albumColumns}
                createItemLink="/admin/albums/create"
                onClickItem={(item) => `/admin/albums/${item.id}`}
                itemPerPage={10}
                onLoadItems={(page, size) =>
                    getAlbums({
                        skip: (page - 1) * size,
                        take: size,
                        sort: "createdAt_desc",
                    })
                }
                onSearchItems={(value, page, size) =>
                    searchAlbums(value, {
                        skip: (page - 1) * size,
                        take: size,
                    })
                }
            />
        </section>
    );
}