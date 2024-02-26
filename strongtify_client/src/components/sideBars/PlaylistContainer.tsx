"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { getPlaylists } from "@/services/api/playlists";
import PlaylistSideBarItem from "./PlaylistSideBarItem";
import useRecentPlaylists from "@/hooks/useRecentPlaylists";

export default function PlaylistContainer() {
    const { data: session, status } = useSession();
    const { playlists, setPlaylists, isLoading, setIsLoading } = useRecentPlaylists();

    useEffect(() => {
        const get = async () => {
            setIsLoading(true);

            const data = await getPlaylists(
                {
                    skip: 0,
                    take: 5,
                    sort: "createdAt_desc",
                    userId: session?.user.id,
                },
                session?.accessToken,
            );

            setPlaylists(data?.results ?? []);
            setIsLoading(false);
        };

        if (status === "authenticated") get();
    }, [status]);

    if (status !== "authenticated") {
        return null;
    }

    return (
        <section className="flex flex-col gap-3 mt-5 -mx-2">
            {!isLoading && playlists.length === 0 && (
                <div className="text-center text-xs text-yellow-50 font-bold">
                    <div className="text-lg">👆</div>
                    Ghé qua Bộ sưu tập để tạo playlist cho bạn nhé!
                </div>
            )}

            {playlists.map((playlist) => (
                <PlaylistSideBarItem key={playlist.id} playlist={playlist} />
            ))}
        </section>
    );
}
