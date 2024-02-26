"use client";

import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { followArtist, unFollowArtist } from "@/services/api/me";
import useFavs from "@/hooks/useFavs";

export default function FollowArtistButton({ artistId }: { artistId: string }) {
    const { data: session, status } = useSession();
    const favs = useFavs();

    const handleClick = async () => {
        if (status === "unauthenticated") {
            toast("Thích artist này ư?, hãy đăng nhập trước đã", {
                icon: "🤨",
            });
            return;
        }

        if (status === "loading" || favs.isLoading) return;

        const isFollowed = favs.followingArtistIds.has(artistId);

        if (isFollowed) {
            unFollowArtist(artistId, session?.accessToken ?? "");
            
            favs.removeFollowingArtistId(artistId);
            
            toast.success("Đã bỏ theo dõi");
        } else {
            followArtist(artistId, session?.accessToken ?? "");

            favs.addFollowingArtistId(artistId);

            toast.success("Đã theo dõi");
        }
    };

    if (status === "loading") {
        return null;
    }

    const isFollowed = favs.followingArtistIds.has(artistId);

    return (
        <button
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
