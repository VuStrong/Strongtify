"use client";

import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { followUser, unFollowUser } from "@/services/api/me";
import useFavs from "@/hooks/store/useFavs";

export default function FollowUserButton({
    userIdToFollow,
}: {
    userIdToFollow: string;
}) {
    const { data: session, status } = useSession();
    const favs = useFavs();

    const handleClick = async () => {
        if (status === "unauthenticated") {
            toast("Thích bạn này ư?, hãy đăng nhập trước đã", { icon: "🤨" });
            return;
        }

        if (status === "loading" || favs.isLoading) return;

        const isFollowed = favs.followingUserIds.has(userIdToFollow);

        if (isFollowed) {
            unFollowUser(userIdToFollow, session?.accessToken ?? "");
            
            favs.removeFollowingUserId(userIdToFollow);
            
            toast.success("Đã bỏ theo dõi");
        } else {
            followUser(userIdToFollow, session?.accessToken ?? "");
            
            favs.addFollowingUserId(userIdToFollow);
            
            toast.success("Đã theo dõi");
        }
    };

    if (status === "loading") {
        return null;
    }

    const isFollowed = favs.followingUserIds.has(userIdToFollow);

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
