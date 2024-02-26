"use client";

import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";
import { likeAlbum, unLikeAlbum } from "@/services/api/me";
import useFavs from "@/hooks/useFavs";

export default function LikeAlbumButton({ albumId }: { albumId: string }) {
    const { data: session, status } = useSession();
    const favs = useFavs();

    const handleClick = async () => {
        if (status === "unauthenticated") {
            toast("Thích ư?, hãy đăng nhập trước đã", { icon: "🤨" });
            return;
        }

        if (status === "loading" || favs.isLoading) return;

        const isLiked = favs.likedAlbumIds.has(albumId);

        if (isLiked) {
            unLikeAlbum(albumId, session?.accessToken ?? "");

            favs.removeLikedAlbumId(albumId);

            toast.success("Đã xóa khỏi danh sách album đã thích");
        } else {
            likeAlbum(albumId, session?.accessToken ?? "");

            favs.addLikedAlbumId(albumId);

            toast.success("Đã thêm vào danh sách album đã thích");
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
            {favs.likedAlbumIds.has(albumId) ? <AiTwotoneHeart /> : <AiOutlineHeart />}
        </div>
    );
}
