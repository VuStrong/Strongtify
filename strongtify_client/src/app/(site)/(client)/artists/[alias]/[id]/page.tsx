import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getArtistById } from "@/services/api/artists";
import { DEFAULT_AVATAR_URL } from "@/libs/constants";
import FollowArtistButton from "@/components/buttons/FollowArtistButton";
import SongSection from "@/components/songs/SongSection";
import AlbumSection from "@/components/albums/AlbumSection";

export default async function ArtistDetailPage({
    params,
}: {
    params: { id: string; alias: string };
}) {
    const artist = await getArtistById(params.id, {
        songLimit: 10,
        albumLimit: 5,
    });

    if (!artist) {
        notFound();
    }

    return (
        <main>
            <div className="bg-darkgray rounded-lg p-10">
                <div className="w-full lg:max-w-full md:flex mb-5">
                    <Image
                        className="w-full md:w-auto md:max-h-[150px] max-h-[250px] rounded-full object-cover"
                        width={150}
                        height={150}
                        src={artist.imageUrl ?? DEFAULT_AVATAR_URL}
                        alt={artist.name}
                    />

                    <div className="p-4 flex flex-col justify-between leading-normal">
                        <div className="md:mb-3">
                            <p className="text-sm text-yellow-100 flex items-center">
                                Nghệ sĩ
                            </p>
                            <div className="text-yellow-50 font-bold text-3xl mb-2">
                                {artist.name}
                            </div>
                            <p className="text-gray-300 text-base">
                                {artist.followerCount} người theo dõi
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-5">
                    <FollowArtistButton artistId={artist.id} />
                </div>

                {artist.about && (
                    <div className="text-gray-500">
                        <p className="text-yellow-50">About:</p>
                        {artist.about}
                    </div>
                )}
            </div>

            <div className="my-8">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-yellow-50 text-2xl font-medium">
                        Bài hát nổi bật
                    </h2>

                    <Link
                        href={`/artists/${params.alias}/${params.id}/songs`}
                        className="text-gray-500 hover:underline"
                    >
                        Hiện tất cả
                    </Link>
                </div>
                <SongSection songs={artist.songs ?? []} />
            </div>

            <div className="mb-8">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-yellow-50 text-2xl font-medium">
                        Album
                    </h2>

                    <Link
                        href={`/artists/${params.alias}/${params.id}/albums`}
                        className="text-gray-500 hover:underline"
                    >
                        Hiện tất cả
                    </Link>
                </div>
                <AlbumSection albums={artist.albums ?? []} />
            </div>
        </main>
    );
}
