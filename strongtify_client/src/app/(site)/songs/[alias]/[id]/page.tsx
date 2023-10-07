import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getSongById } from "@/services/api/songs";
import { NO_IMAGE_URL } from "@/libs/constants";
import getUserSession from "@/services/getUserSession";
import { formatLength } from "@/libs/utils";
import ArtistSection from "@/components/artists/ArtistSection";
import LikeSongButton from "@/components/buttons/LikeSongButton";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const song = await getSongById(params.id);

    if (!song) notFound();

    return {
        title: `Bài hát - ${song.name} | Strongtify`,
        description: `Bài hát - ${song.name} | Strongtify`,
    };
}

export default async function SongDetailPage({
    params,
}: {
    params: { id: string; alias: string };
}) {
    const session = await getUserSession();
    const song = await getSongById(params.id);

    if (!song) notFound();

    return (
        <main>
            <div className="bg-darkgray rounded-lg p-10">
                <div className="w-full lg:max-w-full md:flex mb-5">
                    <Image
                        className="w-full md:w-auto md:max-h-[150px] max-h-[250px] object-cover"
                        width={150}
                        height={150}
                        src={song.imageUrl ?? NO_IMAGE_URL}
                        alt={song.name}
                    />

                    <div className="p-4 flex flex-col justify-between leading-normal">
                        <div className="md:mb-3">
                            <p className="text-sm text-yellow-100 flex items-center">
                                Bài hát
                            </p>
                            <div className="text-yellow-50 font-bold text-3xl mb-2">
                                {song.name}
                            </div>
                            <div className="text-gray-300">
                                <span
                                    title={`${song.releasedAt?.split("T")[0]}`}
                                >
                                    {song.releasedAt &&
                                        new Date(song.releasedAt).getFullYear()}
                                </span>

                                <span className="font-bold"> - </span>

                                {formatLength(song.length)}
                            </div>
                            <div className="text-gray-400">
                                {song.listenCount} lượt nghe - {song.likeCount}{" "}
                                lượt thích
                            </div>
                        </div>
                    </div>
                </div>

                {session?.user?.id && (
                    <div>
                        <LikeSongButton songId={song.id} />
                    </div>
                )}
            </div>

            <div className="my-8">
                <h2 className="text-yellow-50 text-2xl font-medium mb-5">
                    Nghệ sĩ
                </h2>
                <ArtistSection artists={song.artists ?? []} />
            </div>
        </main>
    );
}
