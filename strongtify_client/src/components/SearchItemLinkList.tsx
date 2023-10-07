import Link from "next/link";

export default function SearchItemLinkList({
    activeLink,
    searchValue,
}: {
    activeLink?: string;
    searchValue?: string;
}) {
    return (
        <div className="flex gap-x-5 overflow-x-auto">
            <Link
                href={!activeLink ? "#" : `/search/${searchValue}`}
                className={`
                    rounded-lg px-4 py-2 whitespace-nowrap
                    ${
                        !activeLink
                            ? "bg-primary text-black"
                            : "bg-darkgray text-yellow-50"
                    }
                `}
            >
                Tất cả
            </Link>

            <Link
                href={
                    activeLink === "songs"
                        ? "#"
                        : `/search/${searchValue}/songs`
                }
                className={`
                    rounded-lg px-4 py-2 whitespace-nowrap
                    ${
                        activeLink === "songs"
                            ? "bg-primary text-black"
                            : "bg-darkgray text-yellow-50"
                    }
                `}
            >
                Bài hát
            </Link>

            <Link
                href={
                    activeLink === "albums"
                        ? "#"
                        : `/search/${searchValue}/albums`
                }
                className={`
                    rounded-lg px-4 py-2 whitespace-nowrap
                    ${
                        activeLink === "albums"
                            ? "bg-primary text-black"
                            : "bg-darkgray text-yellow-50"
                    }
                `}
            >
                Album
            </Link>

            <Link
                href={
                    activeLink === "playlists"
                        ? "#"
                        : `/search/${searchValue}/playlists`
                }
                className={`
                    rounded-lg px-4 py-2 whitespace-nowrap
                    ${
                        activeLink === "playlists"
                            ? "bg-primary text-black"
                            : "bg-darkgray text-yellow-50"
                    }
                `}
            >
                Playlist
            </Link>

            <Link
                href={
                    activeLink === "genres"
                        ? "#"
                        : `/search//${searchValue}/genres`
                }
                className={`
                    rounded-lg px-4 py-2 whitespace-nowrap
                    ${
                        activeLink === "genres"
                            ? "bg-primary text-black"
                            : "bg-darkgray text-yellow-50"
                    }
                `}
            >
                Thể Loại
            </Link>

            <Link
                href={
                    activeLink === "artists"
                        ? "#"
                        : `/search/${searchValue}/artists`
                }
                className={`
                    rounded-lg px-4 py-2 whitespace-nowrap
                    ${
                        activeLink === "artists"
                            ? "bg-primary text-black"
                            : "bg-darkgray text-yellow-50"
                    }
                `}
            >
                Nghệ Sĩ
            </Link>

            <Link
                href={
                    activeLink === "users"
                        ? "#"
                        : `/search/${searchValue}/users`
                }
                className={`
                    rounded-lg px-4 py-2 whitespace-nowrap
                    ${
                        activeLink === "users"
                            ? "bg-primary text-black"
                            : "bg-darkgray text-yellow-50"
                    }
                `}
            >
                User
            </Link>
        </div>
    );
}
