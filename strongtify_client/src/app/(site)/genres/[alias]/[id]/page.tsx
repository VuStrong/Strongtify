import Link from "next/link";
import { notFound } from "next/navigation";
import AlbumSection from "@/components/albums/AlbumSection";
import SongSection from "@/components/songs/SongSection";
import { getGenreById } from "@/services/api/genres";
import { NO_IMAGE_URL } from "@/libs/constants";

export default async function GenreDetailPage({
    params,
}: {
    params: { id: string; alias: string };
}) {
    const genre = await getGenreById(params.id, {
        songLimit: 10,
        albumLimit: 5,
    });

    if (!genre) notFound();

    return (
        <main>
            <div
                className="w-full h-[200px] sm:h-[350px] bg-no-repeat bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url(" + genre.imageUrl ?? NO_IMAGE_URL + ")",
                }}
            ></div>

            <div className="my-8">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-yellow-50 text-2xl font-medium">
                        Bài hát nổi bật
                    </h2>

                    <Link
                        href={`/genres/${params.alias}/${params.id}/songs`}
                        className="text-gray-500 hover:underline"
                    >
                        Hiện tất cả
                    </Link>
                </div>
                <SongSection songs={genre.songs ?? []} />
            </div>

            <div className="mb-8">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-yellow-50 text-2xl font-medium">
                        Album
                    </h2>

                    <Link
                        href={`/genres/${params.alias}/${params.id}/albums`}
                        className="text-gray-500 hover:underline"
                    >
                        Hiện tất cả
                    </Link>
                </div>
                <AlbumSection albums={genre.albums ?? []} />
            </div>
        </main>
    );
}
