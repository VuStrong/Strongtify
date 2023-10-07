"use client";

import Image from "next/image";
import useSideBarItems from "@/hooks/useSideBarItems";
import SideBarItem from "./SideBarItem";
import useSideBar from "@/hooks/useSideBar";
import UserMenu from "./UserMenu";
import Link from "next/link";
import PlaylistContainer from "./PlaylistContainer";

export default function SideBar() {
    const sideBar = useSideBar();
    const sideBarItems = useSideBarItems();

    return (
        <aside
            id="sidebar"
            className={`
                fixed top-0 left-0 z-40 h-full transition-transform
                bg-black/5
                ${sideBar.isOpen ? "w-screen" : ""}
                md:w-2/12 
                ${sideBar.isOpen ? "translate-x-0" : "-translate-x-full"}
                -translate-x-full md:translate-x-0
            `}
            onClick={() => {
                sideBar.onClose();
            }}
        >
            <div
                id="sidebar-content"
                className="flex flex-col gap-4 h-full px-5 py-4 overflow-y-auto overflow-x-hidden bg-darkgray w-[250px] md:w-full"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <Link
                    href="/"
                    onClick={() => {
                        sideBar.onClose();
                    }}
                    className="w-[100px] hidden md:block"
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
                            active={item.active}
                            onClick={() => {
                                sideBar.onClose();
                            }}
                        />
                    ))}
                </ul>

                <PlaylistContainer />
            </div>
        </aside>
    );
}
