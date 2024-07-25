"use client";

import useFavs from "@/hooks/store/useFavs";
import {
    likePlaylist,
    unLikePlaylist,
} from "@/services/api/me";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

export default function LikePlaylistButton({
    playlistId,
    size = 48,
}: {
    playlistId: string;
    size?: number;
}) {
    const { data: session, status } = useSession();
    const favs = useFavs();
    
    const handleClick = async () => {
        if (status === "unauthenticated") {
            toast("Thích ư?, hãy đăng nhập trước đã", { icon: "🤨" });
            return;
        }

        if (status === "loading" || favs.isLoading) return;


        const isLiked = favs.likedPlaylistIds.has(playlistId);

        if (isLiked) {
            unLikePlaylist(playlistId, session?.accessToken ?? "");
            
            favs.removeLikedPlaylistId(playlistId);
            
            toast.success("Đã xóa khỏi danh sách playlist đã thích");
        } else {
            likePlaylist(playlistId, session?.accessToken ?? "");
            
            favs.addLikedPlaylistId(playlistId);
            
            toast.success("Đã thêm vào danh sách playlist đã thích");
        }
    };

    if (status === "loading") {
        return null;
    }

    return (
        <button
            className={`text-primary hover:scale-105`}
            onClick={handleClick}
        >
            {favs.likedPlaylistIds.has(playlistId) ? 
                <AiFillHeart size={size} /> : 
                <AiOutlineHeart size={size} />
            }
        </button>
    );
}
