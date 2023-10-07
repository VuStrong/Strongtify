"use client";

import type { Metadata } from "next";
import Image from "next/image";

import TableItem from "@/components/admin/tables/TableItem";
import { getGenres } from "@/services/api/genres";
import { NO_IMAGE_URL } from "@/libs/constants";

export const metadata: Metadata = {
    title: "Quản lý Genres",
};

const genreColumns = [
    {
        name: "imageUrl",
        displayName: "#",
        render: (data: any) => (
            <Image
                src={data ?? NO_IMAGE_URL}
                style={{ width: "100px", height: "auto" }}
                width={100}
                height={50}
                alt="genre"
            />
        ),
    },
    {
        name: "name",
        displayName: "Name",
    },
];

export default function AdminGenresPage() {
    return (
        <section className="mb-5">
            <h1 className="text-primary text-4xl mb-7">Genres</h1>

            <TableItem
                itemName="Genre"
                columns={genreColumns}
                allowPaging={false}
                createItemLink="/admin/genres/create"
                onClickItem={(item) => `/admin/genres/${item.id}`}
                itemPerPage={10}
                onLoadItems={(page, size) => getGenres()}
                onSearchItems={(value, page, size) => getGenres(value)}
            />
        </section>
    );
}
