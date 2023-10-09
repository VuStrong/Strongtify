"use client";

import Link from "next/link";
import Image from "next/image";
import { DEFAULT_AVATAR_URL } from "@/libs/constants";
import { User } from "@/types/user";

export default function UserItem({ user }: { user: User }) {
    return (
        <div
            className="max-w-sm rounded overflow-hidden shadow-lg hover:bg-primary/30 bg-darkgray cursor-pointer p-4"
            title={user.name}
        >
            <Link href={`/users/${user.id}`}>
                <Image
                    className="w-full h-4/6 rounded-full object-cover"
                    width={150}
                    height={150}
                    src={user.imageUrl ?? DEFAULT_AVATAR_URL}
                    alt={user.name}
                />
                <div className="py-4">
                    <div className="font-bold text-xl text-yellow-50 mb-1 truncate">
                        {user.name}
                    </div>
                    <p className="text-gray-500 text-base truncate">
                        {user.followerCount} theo dõi
                    </p>
                </div>
            </Link>
        </div>
    );
}
