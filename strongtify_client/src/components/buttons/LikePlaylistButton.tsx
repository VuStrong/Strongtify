"use client";

import {
    checkLikedPlaylist,
    likePlaylist,
    unLikePlaylist,
} from "@/services/api/me";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";

export default function LikePlaylistButton({
    playlistId,
}: {
    playlistId: string;
}) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const { data: session, status } = useSession();

    useEffect(() => {
        const checkLiked = async () => {
            const isLike = session?.user?.id
                ? await checkLikedPlaylist(playlistId, session.accessToken)
                : false;

            setIsLiked(isLike);
            setIsLoading(false);
        };

        if (status !== "loading") checkLiked();
    }, [status]);

    const handleClick = async () => {
        if (status === "loading" || isLoading) return;

        setIsLoading(true);

        try {
            if (isLiked) {
                await unLikePlaylist(playlistId, session?.accessToken ?? "");
                setIsLiked(false);
                toast.success("Đã xóa khỏi danh sách playlist đã thích");
            } else {
                await likePlaylist(playlistId, session?.accessToken ?? "");
                setIsLiked(true);
                toast.success("Đã thêm vào danh sách playlist đã thích");
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
        <div
            className={`text-primary text-5xl w-fit cursor-pointer hover:scale-105`}
            onClick={handleClick}
        >
            {isLiked ? <AiTwotoneHeart /> : <AiOutlineHeart />}
        </div>
    );
}
