"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";
import { checkLikedAlbum, likeAlbum, unLikeAlbum } from "@/services/api/me";

export default function LikeAlbumButton({ albumId }: { albumId: string }) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const { data: session, status } = useSession();

    useEffect(() => {
        const checkLiked = async () => {
            const isLike = session?.user?.id
                ? await checkLikedAlbum(albumId, session.accessToken)
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
            setIsLiked(!isLiked);

            if (isLiked) {
                toast.success("Đã xóa khỏi danh sách album đã thích");
                await unLikeAlbum(albumId, session?.accessToken ?? "");
            } else {
                toast.success("Đã thêm vào danh sách album đã thích");
                await likeAlbum(albumId, session?.accessToken ?? "");
            }
        } catch (error: any) {
            setIsLiked(!isLiked);
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
