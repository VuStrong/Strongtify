"use client";

import Link from "next/link";
import Image from "next/image";
import { BiMenuAltLeft } from "react-icons/bi";
import useSideBar from "@/hooks/useSideBar";

export default function MobileHeader() {
    const sideBar = useSideBar();

    return (
        <header className="md:hidden flex justify-between items-center mb-4 md:mb-0 bg-darkgray">
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
