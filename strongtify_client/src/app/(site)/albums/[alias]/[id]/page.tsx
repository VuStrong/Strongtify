import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_AVATAR_URL, NO_IMAGE_URL } from "@/libs/constants";
import getUserSession from "@/services/getUserSession";
import { formatLength } from "@/libs/utils";
import { getAlbumById } from "@/services/api/albums";
import LikeAlbumButton from "@/components/buttons/LikeAlbumButton";
import SongSection from "@/components/songs/SongSection";
import PlayButton from "@/components/buttons/PlayButton";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const album = await getAlbumById(params.id);

    if (!album) notFound();

    return {
        title: `Album - ${album.name} | Strongtify`,
        description: `Album - ${album.name} | Strongtify`,
    };
}

export default async function AlbumDetailPage({
    params,
}: {
    params: { id: string; alias: string };
}) {
    const session = await getUserSession();
    const album = await getAlbumById(params.id);

    if (!album) notFound();

    return (
        <main>
            <div className="bg-darkgray rounded-lg p-10">
                <div className="w-full lg:max-w-full md:flex mb-5">
                    <Image
                        className="w-full md:w-auto md:max-h-[150px] max-h-[250px] object-cover"
                        width={150}
                        height={150}
                        src={album.imageUrl ?? NO_IMAGE_URL}
                        alt={album.name}
                    />

                    <div className="p-4 md:pt-0 flex flex-col justify-between leading-normal">
                        <div className="md:mb-3">
                            <p className="text-sm text-yellow-100 flex items-center">
                                Album
                            </p>
                            <div className="text-yellow-50 font-bold text-3xl mb-2">
                                {album.name}
                            </div>

                            {album.artist && (
                                <div className="flex gap-2 mb-3">
                                    <Image
                                        className="rounded-full"
                                        width={28}
                                        height={28}
                                        src={
                                            album.artist.imageUrl ??
                                            DEFAULT_AVATAR_URL
                                        }
                                        alt={album.artist.name}
                                    />
                                    <Link
                                        href={`/artists/${album.artist.alias}/${album.artist.id}`}
                                        className="text-gray-500 text-base truncate hover:underline"
                                    >
                                        {album.artist.name}
                                    </Link>
                                </div>
                            )}

                            <div className="text-gray-300">
                                {album.songCount} bài hát
                                <span> - </span>
                                {formatLength(album.totalLength)}
                            </div>
                            <div className="text-gray-400">
                                {album.likeCount} lượt thích
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <PlayButton songIds={album.songs?.map(song => song.id)} />

                    {session?.user?.id && (
                        <div>
                            <LikeAlbumButton albumId={album.id} />
                        </div>
                    )}
                </div>
            </div>

            <div className="my-8">
                <h2 className="text-yellow-50 text-2xl font-medium mb-3">
                    Danh sách bài hát
                </h2>

                <SongSection songs={album.songs ?? []} oneColumn showIndex />
            </div>
        </main>
    );
}
