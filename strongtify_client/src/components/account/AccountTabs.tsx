"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineAccountCircle, MdLock } from "react-icons/md";

export default function AccountTabs() {
    const pathname = usePathname();

    return (
        <ul className="md:mt-3 flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0 whitespace-nowrap">
            <li>
                <Link
                    href="/account"
                    className={
                        pathname === "/account"
                            ? "inline-flex items-center px-4 py-3 text-white bg-primary rounded-lg active w-full"
                            : "inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-900 hover:bg-gray-600 w-full"
                    }
                >
                    <MdOutlineAccountCircle className="me-2 text-white" size={30} />
                    Thông tin tài khoản
                </Link>
            </li>
            <li>
                <Link
                    href="/account/password"
                    className={
                        pathname === "/account/password"
                            ? "inline-flex items-center px-4 py-3 text-white bg-primary rounded-lg active w-full"
                            : "inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-900 hover:bg-gray-600 w-full"
                    }
                >
                    <MdLock className="me-2 text-white" size={30} />
                    Mật khẩu
                </Link>
            </li>
        </ul>
    );
}
