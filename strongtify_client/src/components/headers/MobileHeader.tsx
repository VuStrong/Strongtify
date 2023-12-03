"use client";

import Link from "next/link";
import Image from "next/image";
import { BiMenuAltLeft } from "react-icons/bi";
import useSideBar from "@/hooks/useSideBar";
import useScrollDirection from "@/hooks/useScrollDirection";

export default function MobileHeader() {
    const sideBar = useSideBar();
    const direction = useScrollDirection();

    return (
        <header className={`
            fixed md:hidden flex justify-between items-center py-1
            bg-darkgray left-0 right-0 z-20 transition-all
            ${ direction === "down" ? "-top-24" : "top-0"}
        `}>
            <button
                type="button"
                className="p-2 rounded-lg focus:outline-none focus:ring-2"
                onClick={() => {
                    sideBar.toggle();
                }}
            >
                <BiMenuAltLeft size={24} className="text-yellow-50" />
            </button>

            <Link href="/" className="w-[60px]">
                <Image
                    src="/img/icons/LogoIcon.png"
                    width={60}
                    height={30}
                    alt="Strongtify"
                />
            </Link>

            <div></div>
        </header>
    );
}
