"use client";

import { User } from "@/types/user";
import UserItem from "./UserItem";

export default function UserSection({ users }: { users: User[] }) {
    return (
        <section
            className={`grid md:grid-cols-4 lg:grid-cols-5 grid-cols-2 sm:gap-6 gap-3`}
        >
            {users?.length === 0 && (
                <div className="text-gray-500">Không có kết quả</div>
            )}
            {users.map((user) => (
                <UserItem key={user.id} user={user} />
            ))}
        </section>
    );
}
