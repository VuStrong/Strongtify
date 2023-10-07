"use client";

import type { Metadata } from "next";
import Image from "next/image";
import { useSession } from "next-auth/react";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

import TableItem from "@/components/admin/tables/TableItem";
import { getAccounts } from "@/services/api/accounts";
import { DEFAULT_AVATAR_URL } from "@/libs/constants";

export const metadata: Metadata = {
    title: "Quản lý Users",
};

const userColumns = [
    {
        name: "imageUrl",
        displayName: "#",
        render: (data: any) => (
            <Image
                src={data ?? DEFAULT_AVATAR_URL}
                style={{ width: "50px", height: "auto" }}
                width={50}
                height={50}
                alt="user"
            />
        ),
    },
    {
        name: "name",
        displayName: "Name",
    },
    {
        name: "email",
        displayName: "Email",
    },
    {
        name: "emailConfirmed",
        displayName: "Email Confirmed",
        render: (data: any) => (
            <div className="px-4 py-2">{data.toString()}</div>
        ),
    },
    {
        name: "locked",
        displayName: "Locked",
        render: (data: any) => (
            <div className="px-4 py-2">{data.toString()}</div>
        ),
    },
    {
        name: "role",
        displayName: "Role",
        render: (data: any) => (
            <div
                className={`px-4 py-2 ${data === "ADMIN" && "text-yellow-500"}`}
            >
                {data}
            </div>
        ),
    },
];

export default function AdminUsersPage() {
    const { data: session } = useSession();

    return (
        <section className="mb-5">
            <h1 className="text-primary text-4xl mb-7">Users</h1>

            {session?.user ? (
                <TableItem
                    itemName="User"
                    readonly
                    columns={userColumns}
                    onClickItem={(item) => `/admin/users/${item.id}`}
                    itemPerPage={10}
                    onLoadItems={(page, size) =>
                        getAccounts(
                            {
                                skip: (page - 1) * size,
                                take: size,
                                sort: "createdAt_desc",
                            },
                            session?.accessToken ?? "",
                        )
                    }
                    onSearchItems={(value, page, size) =>
                        getAccounts(
                            {
                                skip: (page - 1) * size,
                                take: size,
                                sort: "createdAt_desc",
                                q: value,
                            },
                            session?.accessToken ?? "",
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
