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
        if (status === "unauthenticated") {
            toast('Thích artist này ư?, hãy đăng nhập trước đã', { icon: '🤨' });
            return;
        }

        if (status === "loading" || isLoading) return;

        setIsLoading(true);

        try {
            setIsFollowed(!isFollowed);

            if (isFollowed) {
                toast.success("Đã bỏ theo dõi");
                await unFollowArtist(artistId, session?.accessToken ?? "");
            } else {
                toast.success("Đã theo dõi");
                await followArtist(artistId, session?.accessToken ?? "");
            }
        } catch (error: any) {
            setIsFollowed(!isFollowed);
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
