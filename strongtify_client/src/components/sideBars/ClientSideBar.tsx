"use client";

import Image from "next/image";
import { FaHistory, FaRegHeart } from "react-icons/fa";
import SideBarItem from "./SideBarItem";
import useSideBar from "@/hooks/store/useSideBar";
import UserMenu from "./UserMenu";
import Link from "next/link";
import PlaylistContainer from "./PlaylistContainer";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { GiRank3 } from "react-icons/gi";
import { HiOutlineCollection } from "react-icons/hi";

const sideBarItems = [
    {
        icon: AiOutlineHome,
        name: "Trang chủ",
        href: "/",
        isActive: (pathname: string) => pathname === "/" 
    },
    {
        icon: AiOutlineSearch,
        name: "Tìm kiếm",
        href: "/search",
        isActive: (pathname: string) => pathname?.startsWith("/search")
    },
    {
        icon: GiRank3,
        name: "Bảng xếp hạng",
        href: "/rank",
        isActive: (pathname: string) => pathname === "/rank" 
    },
    {
        icon: HiOutlineCollection,
        name: "Bộ sưu tập",
        href: "/collection",
        isActive: (pathname: string) => pathname === "/collection" 
    },
];

export default function ClientSideBar() {
    const sideBar = useSideBar();
    const pathname = usePathname();
    const { status } = useSession();
    
    return (
        <aside
            id="sidebar"
            className={`
                fixed top-0 left-0 z-40 h-full transition-transform
                bg-black/5
                ${sideBar.isOpen ? "w-screen" : ""}
                lg:w-2/12 
                ${sideBar.isOpen ? "translate-x-0" : "-translate-x-full"}
                -translate-x-full lg:translate-x-0
            `}
            onClick={() => {
                sideBar.onClose();
            }}
        >
            <div
                id="sidebar-content"
                className="flex flex-col pb-20 gap-4 h-full px-5 py-4 overflow-y-auto overflow-x-hidden bg-darkgray w-[250px] lg:w-full"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <Link
                    href="/"
                    onClick={() => {
                        sideBar.onClose();
                    }}
                    className="w-[100px] hidden lg:block"
                >
                    <Image
                        src="/img/icons/LogoIcon.png"
                        width={100}
                        height={50}
                        alt="Strongtify"
                    />
                </Link>

                <hr className="border-gray-500" />

                <UserMenu />

                <hr className="border-gray-500" />

                <ul className="space-y-3 font-medium text-yellow-50">
                    {sideBarItems?.map((item) => (
                        <SideBarItem
                            key={item.name}
                            name={item.name}
                            href={item.href}
                            icon={item.icon}
                            active={item.isActive(pathname ?? "")}
                            onClick={() => {
                                sideBar.onClose();
                            }}
                        />
                    ))}
                </ul>

                {status === "authenticated" && (
                    <>
                        <hr className="border-gray-500" />
                        <ul className="space-y-3 font-medium text-yellow-50">
                            <SideBarItem
                                key="history"
                                name="Nghe gần đây"
                                href="/collection/history"
                                icon={FaHistory}
                                active={pathname?.startsWith("/collection/history") ?? false}
                                onClick={() => {
                                    sideBar.onClose();
                                }}
                            />
                            <SideBarItem
                                key="liked"
                                name="Bài hát đã thích"
                                href="/collection/liked-songs"
                                icon={FaRegHeart}
                                active={pathname?.startsWith("/collection/liked-songs") ?? false}
                                onClick={() => {
                                    sideBar.onClose();
                                }}
                            />
                        </ul>
                        <hr className="border-gray-500" />
                    </>
                )}

                <PlaylistContainer />
            </div>
        </aside>
    );
}
