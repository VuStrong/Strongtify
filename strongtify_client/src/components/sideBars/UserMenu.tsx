"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import useSideBar from "@/hooks/store/useSideBar";
import { logout } from "@/services/api/auth";
import { DEFAULT_AVATAR_URL } from "@/libs/constants";
import { useState } from "react";
import useAccount from "@/hooks/useAccount";

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const sideBar = useSideBar();
    const pathname = usePathname();

    const { data: session } = useSession();
    const { account, isLoading } = useAccount();

    const handleLogout = async () => {
        if (!session) return;

        await logout(session.refreshToken, session.accessToken);
        signOut();
    };

    if (isLoading) {
        return null;
    }

    return account ? (
        <>
            <div
                className="flex items-center justify-between gap-x-5 text-lg cursor-pointer"
                onClick={() => {
                    setIsOpen(!isOpen);
                }}
            >
                <div className="flex items-center gap-x-5">
                    <Image
                        className="rounded-lg"
                        src={account.imageUrl ?? DEFAULT_AVATAR_URL}
                        alt="avatar"
                        width={24}
                        height={24}
                    />
                    <span className="text-yellow-50 truncate w-[130px]">
                        {account.name}
                    </span>
                </div>
                {isOpen ? (
                    <AiFillCaretUp className="text-primary" size={24} />
                ) : (
                    <AiFillCaretDown className="text-primary" size={24} />
                )}
            </div>
            <ul className={`${isOpen ? "" : "hidden"} py-2 space-y-2`}>
                <li className="flex items-center w-full p-2 text-gray-400 pl-11">
                    <Link
                        href={`/users/${account.id}`}
                        onClick={() => {
                            sideBar.onClose();
                        }}
                    >
                        Hồ sơ
                    </Link>
                </li>
                <li className="flex items-center w-full p-2 text-gray-400 pl-11">
                    <Link
                        href={"/account"}
                        onClick={() => {
                            sideBar.onClose();
                        }}
                    >
                        Tài khoản
                    </Link>
                </li>
                {account.role === "ADMIN" && (
                    <li className="flex items-center w-full p-2 text-gray-400 pl-11">
                        <Link
                            href={"/admin"}
                            onClick={() => {
                                sideBar.onClose();
                            }}
                        >
                            Admin Dashboard
                        </Link>
                    </li>
                )}
                <li className="flex items-center w-full p-2 text-gray-400 pl-11">
                    <div className="cursor-pointer" onClick={handleLogout}>
                        Đăng xuất
                    </div>
                </li>
            </ul>
        </>
    ) : (
        <div className="">
            <div className="text-center text-xs text-yellow-50 font-bold">
                Đăng nhập để tạo cho riêng mình những playlist độc đáo nhé!
            </div>
            <a
                href={`/login?callbackUrl=${pathname}`}
                className="bg-primary p-2 text-center font-bold mt-3 w-full block rounded-lg text-black"
            >
                Đăng nhập
            </a>
        </div>
    );
}
