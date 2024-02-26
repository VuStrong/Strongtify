"use client";

import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";
import { likeSong, unLikeSong } from "@/services/api/me";
import useFavs from "@/hooks/useFavs";

export default function LikeSongButton({ songId }: { songId: string }) {
    const { data: session, status } = useSession();
    const favs = useFavs();

    const handleClick = async () => {
        if (status === "unauthenticated") {
            toast("Thích ư?, hãy đăng nhập trước đã", { icon: "🤨" });
            return;
        }

        if (status === "loading" || favs.isLoading) return;

        const isLiked = favs.likedSongIds.has(songId);

        if (isLiked) {
            unLikeSong(songId, session?.accessToken ?? "");
            
            favs.removeLikedSongId(songId);
            
            toast.success("Đã xóa khỏi danh sách bài hát đã thích");
        } else {
            likeSong(songId, session?.accessToken ?? "");

            favs.addLikedSongId(songId);

            toast.success("Đã thêm vào danh sách bài hát đã thích");
        }
    };

    if (status === "loading") {
        return null;
    }

    return (
        <div
            className={`text-primary text-5xl w-fit cursor-pointer hover:scale-105`}
            onClick={handleClick}
        >
            {favs.likedSongIds.has(songId) ? <AiTwotoneHeart /> : <AiOutlineHeart />}
        </div>
    );
}
