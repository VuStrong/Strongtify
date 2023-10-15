"use client";

import Image from "next/image";

import TableItem from "@/components/admin/tables/TableItem";
import { getArtists } from "@/services/api/artists";
import { DEFAULT_AVATAR_URL } from "@/libs/constants";

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
                createPage="/admin/artists/create"
                generateItemLink={(item) => `/admin/artists/${item.id}`}
                itemPerPage={10}
                onLoadItems={(page, size) =>
                    getArtists({
                        skip: (page - 1) * size,
                        take: size,
                        sort: "updatedAt_desc",
                    })
                }
                onSearchItems={(value, page, size) =>
                    getArtists({
                        skip: (page - 1) * size,
                        take: size,
                        sort: "updatedAt_desc",
                        q: value
                    })
                }
            />
        </section>
    );
}
