import { notFound } from "next/navigation";
import Image from "next/image";

import getUserSession from "@/services/getUserSession";
import { getUserById } from "@/services/api/users";
import { DEFAULT_AVATAR_URL } from "@/libs/constants";
import FollowUserButton from "@/components/buttons/FollowUserButton";
import PlaylistSection from "@/components/playlists/PlaylistSection";
import Link from "next/link";
import UserSection from "@/components/users/UserSection";
import ArtistSection from "@/components/artists/ArtistSection";

export default async function UserDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await getUserSession();
    const user = await getUserById(
        params.id,
        {
            followerLimit: 5,
            followingArtistLimit: 5,
            followingUserLimit: 5,
            playlistLimit: 5,
        },
        session?.accessToken,
    );

    if (!user) {
        notFound();
    }

    return (
        <section>
            <div className="bg-darkgray rounded-lg p-10">
                <div className="w-full lg:max-w-full md:flex mb-5">
                    <Image
                        className="w-full md:max-w-[150px] md:max-h-[150px] max-h-[250px] rounded-full object-cover"
                        width={150}
                        height={150}
                        src={user.imageUrl ?? DEFAULT_AVATAR_URL}
                        alt={user.name}
                    />

                    <div className="p-4 flex flex-col justify-between leading-normal">
                        <div className="md:mb-3">
                            <p className="text-sm text-yellow-100 flex items-center">
                                Hồ sơ
                            </p>
                            <div className="text-yellow-50 font-bold text-3xl mb-2">
                                {user.name}
                            </div>
                            <p className="text-gray-300 text-base">
                                {user.followerCount} người theo dõi
                            </p>
                            <p className="text-gray-300 text-base">
                                {user.playlistCount} danh sách phát
                            </p>
                        </div>
                    </div>
                </div>

                {session?.user?.id && user.id !== session?.user.id && (
                    <div className="mb-5">
                        <FollowUserButton userIdToFollow={user.id} />
                    </div>
                )}
                {user.about && (
                    <div className="text-gray-500">
                        <p className="text-yellow-50">About me:</p>
                        {user.about}
                    </div>
                )}
            </div>

            <div className="my-8">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-yellow-50 text-2xl font-medium">
                        Playlist
                    </h2>

                    <Link
                        href={`/users/${user.id}/playlists`}
                        className="text-gray-500 hover:underline"
                    >
                        Hiện tất cả
                    </Link>
                </div>
                <PlaylistSection playlists={user.playlists ?? []} />
            </div>

            <div className="mb-8">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-yellow-50 text-2xl font-medium">
                        Nghệ sĩ đang theo dõi
                    </h2>

                    <Link
                        href={`/users/${user.id}/following-artists`}
                        className="text-gray-500 hover:underline"
                    >
                        Hiện tất cả
                    </Link>
                </div>
                <ArtistSection artists={user.followingArtists ?? []} />
            </div>

            <div className="mb-8">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-yellow-50 text-2xl font-medium">
                        Người theo dõi
                    </h2>

                    <Link
                        href={`/users/${user.id}/followers`}
                        className="text-gray-500 hover:underline"
                    >
                        Hiện tất cả
                    </Link>
                </div>
                <UserSection users={user.followers ?? []} />
            </div>

            <div className="mb-8">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-yellow-50 text-2xl font-medium">
                        Đang theo dõi
                    </h2>

                    <Link
                        href={`/users/${user.id}/following-users`}
                        className="text-gray-500 hover:underline"
                    >
                        Hiện tất cả
                    </Link>
                </div>
                <UserSection users={user.followings ?? []} />
            </div>
        </section>
    );
}
