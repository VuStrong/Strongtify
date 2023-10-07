"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { checkFollowingArtist } from "@/services/api/users";
import { followArtist, unFollowArtist } from "@/services/api/me";

export default function FollowArtistButton({ artistId }: { artistId: string }) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFollowed, setIsFollowed] = useState<boolean>(false);
    const { data: session, status } = useSession();

    useEffect(() => {
        const checkFollow = async () => {
            const isFollow = session?.user?.id
                ? await checkFollowingArtist(session.user.id, artistId)
                : false;

            setIsFollowed(isFollow);
            setIsLoading(false);
        };

        if (status !== "loading") checkFollow();
    }, [status]);

    const handleClick = async () => {
        if (status === "loading") return;

        setIsLoading(true);

        try {
            if (isFollowed) {
                await unFollowArtist(artistId, session?.accessToken ?? "");
                setIsFollowed(false);
                toast.success("Đã bỏ theo dõi");
            } else {
                await followArtist(artistId, session?.accessToken ?? "");
                setIsFollowed(true);
                toast.success("Đã theo dõi");
            }
        } catch (error: any) {
            toast.error(error.message);
        }

        setIsLoading(false);
    };

    if (status === "loading") {
        return null;
    }

    return (
        <button
            disabled={isLoading}
            className={`
                rounded-full border-solid border-2 px-5 py-2 hover:scale-x-105
                ${isFollowed ? "border-primary" : "border-gray-500"}
                ${isFollowed ? "bg-primary" : "bg-darkgray"}
                ${isFollowed ? "text-black" : "text-yellow-50"}
            `}
            onClick={handleClick}
        >
            {isFollowed ? "Bỏ theo dõi" : "Theo dõi"}
        </button>
    );
}
