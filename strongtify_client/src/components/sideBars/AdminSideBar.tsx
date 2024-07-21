"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { BsFileMusicFill, BsFilePerson, BsJournalAlbum } from "react-icons/bs";
import { BiSolidCategory, BiSolidPlaylist } from "react-icons/bi";
import SideBarItem from "./SideBarItem";
import useSideBar from "@/hooks/store/useSideBar";
import UserMenu from "./UserMenu";

const sideBarItems = [
    {
        icon: AiOutlineHome,
        name: "Dashboard",
        href: "/admin",
        isActive: (pathname: string) => pathname === "/admin",
    },
    {
        icon: AiOutlineUser,
        name: "Users",
        href: "/admin/users",
        isActive: (pathname: string) => pathname.startsWith("/admin/users"),
    },
    {
        icon: BsFileMusicFill,
        name: "Songs",
        href: "/admin/songs",
        isActive: (pathname: string) => pathname.startsWith("/admin/songs"),
    },
    {
        icon: BsJournalAlbum,
        name: "Albums",
        href: "/admin/albums",
        isActive: (pathname: string) => pathname.startsWith("/admin/albums"),
    },
    {
        icon: BsFilePerson,
        name: "Artists",
        href: "/admin/artists",
        isActive: (pathname: string) => pathname.startsWith("/admin/artists"),
    },
    {
        icon: BiSolidPlaylist,
        name: "Playlists",
        href: "/admin/playlists",
        isActive: (pathname: string) => pathname.startsWith("/admin/playlists"),
    },
    {
        icon: BiSolidCategory,
        name: "Genres",
        href: "/admin/genres",
        isActive: (pathname: string) => pathname.startsWith("/admin/genres"),
    },
];

export default function AdminSideBar() {
    const sideBar = useSideBar();
    const pathname = usePathname();

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
            </div>
        </aside>
    );
}
