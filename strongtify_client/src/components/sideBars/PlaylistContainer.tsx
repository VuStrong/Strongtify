"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getPlaylists } from "@/services/api/playlists";
import { Playlist } from "@/types/playlist";
import PlaylistSideBarItem from "./PlaylistSideBarItem";

export default function PlaylistContainer() {
    const [playlists, setPlaylists] = useState<Playlist[]>();
    const { data: session, status } = useSession();

    useEffect(() => {
        const get = async () => {
            const data = await getPlaylists(
                {
                    skip: 0,
                    take: 5,
                    sort: "createdAt_desc",
                    userId: session?.user.id,
                },
                session?.accessToken,
            );

            setPlaylists(data?.results);
        };

        if (status === "authenticated") get();
    }, [status]);

    if (status !== "authenticated") {
        return null;
    }

    return (
        <section className="flex flex-col gap-3 mt-5 -mx-2">
            {playlists?.map((playlist) => (
                <PlaylistSideBarItem key={playlist.id} playlist={playlist} />
            ))}
        </section>
    );
}
