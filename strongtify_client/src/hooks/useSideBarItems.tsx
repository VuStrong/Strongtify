import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { IconType } from "react-icons";
import {
    AiOutlineHome,
    AiOutlineSearch,
    AiOutlineUser,
    AiFillLock,
} from "react-icons/ai";
import { GiRank3 } from "react-icons/gi";
import { HiOutlineCollection } from "react-icons/hi";
import { BsFileMusicFill, BsJournalAlbum, BsFilePerson } from "react-icons/bs";
import { BiSolidPlaylist, BiSolidCategory } from "react-icons/bi";

export default function useSideBarItems() {
    const pathname = usePathname();

    const sideBarItems = useMemo(() => {
        let items: {
            icon: IconType;
            name: string;
            href: string;
            active: boolean;
        }[];

        switch (true) {
            case pathname?.startsWith("/admin"):
                items = [
                    {
                        icon: AiOutlineHome,
                        name: "Dashboard",
                        href: "/admin",
                        active: pathname === "/admin",
                    },
                    {
                        icon: AiOutlineUser,
                        name: "Users",
                        href: "/admin/users",
                        active: pathname?.startsWith("/admin/users") ?? false,
                    },
                    {
                        icon: BsFileMusicFill,
                        name: "Songs",
                        href: "/admin/songs",
                        active: pathname?.startsWith("/admin/songs") ?? false,
                    },
                    {
                        icon: BsJournalAlbum,
                        name: "Albums",
                        href: "/admin/albums",
                        active: pathname?.startsWith("/admin/albums") ?? false,
                    },
                    {
                        icon: BsFilePerson,
                        name: "Artists",
                        href: "/admin/artists",
                        active: pathname?.startsWith("/admin/artists") ?? false,
                    },
                    {
                        icon: BiSolidPlaylist,
                        name: "Playlists",
                        href: "/admin/playlists",
                        active:
                            pathname?.startsWith("/admin/playlists") ?? false,
                    },
                    {
                        icon: BiSolidCategory,
                        name: "Genres",
                        href: "/admin/genres",
                        active: pathname?.startsWith("/admin/genres") ?? false,
                    },
                ];
                break;
            case pathname?.startsWith("/account"):
                items = [
                    {
                        icon: AiOutlineHome,
                        name: "Overview",
                        href: "/account",
                        active: pathname === "/account",
                    },
                    {
                        icon: AiFillLock,
                        name: "Password",
                        href: "/account/password",
                        active: pathname === "/account/password",
                    },
                ];
                break;
            default:
                items = [
                    {
                        icon: AiOutlineHome,
                        name: "Trang chủ",
                        href: "/",
                        active: pathname === "/",
                    },
                    {
                        icon: AiOutlineSearch,
                        name: "Tìm kiếm",
                        href: "/search",
                        active: pathname?.startsWith("/search") ?? false,
                    },
                    {
                        icon: GiRank3,
                        name: "Bảng xếp hạng",
                        href: "/rank",
                        active: pathname === "/rank",
                    },
                    {
                        icon: HiOutlineCollection,
                        name: "Bộ sưu tập",
                        href: "/collection",
                        active: pathname?.startsWith("/collection") ?? false,
                    },
                ];
                break;
        }

        return items;
    }, [pathname]);

    return sideBarItems;
}
