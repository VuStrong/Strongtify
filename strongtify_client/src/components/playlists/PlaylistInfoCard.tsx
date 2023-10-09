"use client";

import Image from "next/image";
import Link from "next/link";
import { BsThreeDots } from "react-icons/bs";
import { DEFAULT_AVATAR_URL, NO_IMAGE_URL } from "@/libs/constants";
import { formatLength } from "@/libs/utils";
import { PlaylistDetail } from "@/types/playlist";
import { useSession } from "next-auth/react";
import LikePlaylistButton from "../buttons/LikePlaylistButton";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AiFillLock } from "react-icons/ai";
import { useCallback, useState } from "react";
import Modal from "../modals/Modal";
import Button from "../buttons/Button";
import { deletePlaylist, updatePlaylist } from "@/services/api/playlists";
import UpdatePlaylistForm from "./UpdatePlaylistForm";
import PlayButton from "../buttons/PlayButton";

export default function PlaylistInfoCard({
    playlist,
}: {
    playlist: PlaylistDetail;
}) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const router = useRouter();
    const { data: session } = useSession();

    const handleDeletePlaylist = useCallback(async () => {
        setIsModalOpen(false);

        try {
            await deletePlaylist(playlist.id, session?.accessToken ?? "");

            toast.success("Đã xóa playlist");
            router.refresh();
            router.push("/");
        } catch (error: any) {
            toast.error(error.message);
        }
    }, [session?.accessToken]);

    const handleChangePlaylistStatus = useCallback(
        async (status: "PUBLIC" | "PRIVATE") => {
            setIsModalOpen(false);

            try {
                await updatePlaylist(
                    playlist.id,
                    {
                        name: playlist.name,
                        status,
                        description: playlist.description,
                    },
                    session?.accessToken ?? "",
                );

                toast.success("Đã cập nhập trạng thái playlist");
                router.refresh();
            } catch (error: any) {
                toast.error(error.message);
            }
        },
        [session?.accessToken],
    );

    return (
        <>
            {/* Edit playlist modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClickClose={() => {
                    setIsEditModalOpen(false);
                }}
            >
                <UpdatePlaylistForm
                    playlist={playlist}
                    onUpdated={() => {
                        setIsEditModalOpen(false);
                        router.refresh();
                    }}
                />
            </Modal>

            {/* Playlist options modal */}
            <Modal
                isOpen={isModalOpen}
                onClickClose={() => {
                    setIsModalOpen(false);
                }}
            >
                <div className="text-yellow-50 p-4 flex flex-col gap-3">
                    {session?.user?.id && session.user.id === playlist.user.id && (
                        <>
                            <Button
                                label="Chỉnh sửa thông tin playlist"
                                onClick={() => {
                                    setIsEditModalOpen(true);
                                    setIsModalOpen(false);
                                }}
                                outline
                            />

                            {playlist.status === "PUBLIC" ? (
                                <Button
                                    label="Đặt thành riêng tư"
                                    onClick={() => {
                                        handleChangePlaylistStatus("PRIVATE");
                                    }}
                                    outline
                                />
                            ) : (
                                <Button
                                    label="Đặt thành công khai"
                                    onClick={() => {
                                        handleChangePlaylistStatus("PUBLIC");
                                    }}
                                    outline
                                />
                            )}

                            <Button
                                label="Xóa playlist này"
                                onClick={handleDeletePlaylist}
                                outline
                            />
                        </>
                    )}

                    <Button
                        label="Copy link playlist"
                        onClick={() => {
                            navigator.clipboard.writeText(`${window.location.hostname}/playlists/${playlist.id}`);
                            toast.success("Đã copy link playlist");
                            setIsModalOpen(false);
                        }}
                        outline
                    />
                </div>
            </Modal>

            <div className="bg-darkgray rounded-lg p-10">
                <div className="w-full lg:max-w-full md:flex mb-5 relative">
                    <Image
                        className="w-full md:w-auto md:max-h-[150px] max-h-[250px] object-cover"
                        width={150}
                        height={150}
                        src={playlist.imageUrl ?? NO_IMAGE_URL}
                        alt={playlist.name}
                    />

                    {playlist.status === "PRIVATE" && (
                        <div className="text-error absolute w-fit top-0 -left-1 text-3xl">
                            <AiFillLock />
                        </div>
                    )}

                    <div className="p-4 md:pt-0 flex flex-col justify-between leading-normal">
                        <div className="md:mb-3">
                            <p className="text-sm text-yellow-100 flex items-center">
                                Playlist
                            </p>
                            <div className="text-yellow-50 font-bold text-3xl mb-2">
                                {playlist.name}
                            </div>

                            <div className="flex gap-2 mb-3">
                                <Image
                                    className="rounded-full"
                                    width={28}
                                    height={28}
                                    src={
                                        playlist.user.imageUrl ??
                                        DEFAULT_AVATAR_URL
                                    }
                                    alt={playlist.user.name}
                                />
                                <Link
                                    href={`/users/${playlist.user.id}`}
                                    className="text-gray-500 text-base truncate hover:underline"
                                >
                                    {playlist.user.name}
                                </Link>
                            </div>

                            <div className="text-gray-300">
                                {playlist.songCount} bài hát
                                <span> - </span>
                                {formatLength(playlist.totalLength)}
                            </div>
                            <div className="text-gray-400">
                                {playlist.likeCount} lượt thích
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 items-center mb-3">
                    <PlayButton songIds={playlist.songs?.map(song => song.id)} />

                    {session?.user?.id && session.user.id !== playlist.user.id && (
                        <div>
                            <LikePlaylistButton playlistId={playlist.id} />
                        </div>
                    )}

                    <div
                        className="w-fit text-3xl text-gray-300 cursor-pointer hover:text-white"
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                    >
                        <BsThreeDots />
                    </div>
                </div>

                {playlist.description && (
                    <div className="text-gray-500">
                        <p className="text-yellow-50">Description:</p>
                        {playlist.description}
                    </div>
                )}
            </div>
        </>
    );
}
