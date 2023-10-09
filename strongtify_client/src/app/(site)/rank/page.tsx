import { Metadata } from "next";
import Link from "next/link";
import TopSongsSection from "@/components/songs/TopSongsSection";
import { getTopSongs } from "@/services/api/songs";
import PlayButton from "@/components/buttons/PlayButton";

export const metadata: Metadata = {
    title: `Strongtify - Bảng xếp hạng`,
    description:
        "Strongtify - Bảng xếp hạng các bài hát được nghe nhiều nhất trong ngày, tuần, tháng vừa qua.",
};

export default async function RankPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | undefined };
}) {
    let time =
        searchParams && searchParams["time"] ? searchParams["time"] : "day";
    if (time !== "day" && time !== "week" && time !== "month") {
        time = "day";
    }

    const topSongs = await getTopSongs(time);

    return (
        <main>
            <h1 className="text-yellow-50 text-3xl font-semibold mb-4">
                Bảng xếp hạng
            </h1>

            <div className="flex gap-x-5 overflow-x-auto mb-5">
                <Link
                    href={`/rank?time=day`}
                    className={`
                        rounded-lg px-4 py-2 whitespace-nowrap
                        ${time === "day" ? "bg-primary" : "bg-darkgray"}
                        ${time === "day" ? "text-black" : "text-yellow-50"}
                    `}
                >
                    Ngày
                </Link>

                <Link
                    href={`/rank?time=week`}
                    className={`
                        rounded-lg px-4 py-2 whitespace-nowrap
                        ${time === "week" ? "bg-primary" : "bg-darkgray"}
                        ${time === "week" ? "text-black" : "text-yellow-50"}
                    `}
                >
                    Tuần
                </Link>

                <Link
                    href={`/rank?time=month`}
                    className={`
                        rounded-lg px-4 py-2 whitespace-nowrap
                        ${time === "month" ? "bg-primary" : "bg-darkgray"}
                        ${time === "month" ? "text-black" : "text-yellow-50"}
                    `}
                >
                    Tháng
                </Link>
            </div>

            <div className="mb-5">
                <PlayButton songIds={topSongs?.map(song => song.id)} />
            </div>

            <TopSongsSection topSongs={topSongs ?? []} />
        </main>
    );
}
