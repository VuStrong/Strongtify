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
import { useState } from "react";
import Modal from "../modals/Modal";
import Button from "../buttons/Button";
import { deletePlaylist } from "@/services/api/playlists";
import DeleteConfirmContent from "../modals/modal-contents/DeleteConfirmContent";
import useRecentPlaylists from "@/hooks/store/useRecentPlaylists";
import PlayButton from "../buttons/PlayButton";
import UpdatePlaylistModal from "../modals/UpdatePlaylistModal";

export default function PlaylistInfoCard({
    playlist,
    onPlaylistInfoUpdated,
}: {
    playlist: PlaylistDetail;
    onPlaylistInfoUpdated?: (playlist: PlaylistDetail) => void,
}) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDelPlaylistModalOpen, setIsDelPlaylistModalOpen] =
        useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const router = useRouter();
    const { data: session } = useSession();

    const fetchRecentPlaylists = useRecentPlaylists(
        (state) => state.fetchRecentPlaylists,
    );

    const handleDeletePlaylist = () => {
        setIsModalOpen(false);
        setIsDelPlaylistModalOpen(false);

        const deleteTask = async () => {
            await deletePlaylist(playlist.id, session?.accessToken ?? "");

            fetchRecentPlaylists();

            router.push("/");
        };

        toast.promise(deleteTask(), {
            loading: "Đang xóa playlist",
            success: "Đã xóa playlist",
            error: "Không thể xóa playlist, hãy thử lại",
        });
    };

    return (
        <>
            {/* Edit playlist modal */}
            <UpdatePlaylistModal 
                isOpen={isEditModalOpen}
                playlist={playlist}
                onClose={() => setIsEditModalOpen(false)}
                onUpdating={() => {
                    setIsEditModalOpen(false);
                }}
                onUpdated={(updatedPlaylist) => {
                    setIsEditModalOpen(false);
                    fetchRecentPlaylists();

                    onPlaylistInfoUpdated?.(updatedPlaylist);
                }}
            />

            {/* Playlist options modal */}
            <Modal
                isOpen={isModalOpen}
                onClickClose={() => {
                    setIsModalOpen(false);
                }}
            >
                <div className="text-yellow-50 p-4 flex flex-col gap-3">
                    {session?.user?.id &&
                        session.user.id === playlist.user.id && (
                            <>
                                <Button
                                    label="Chỉnh sửa thông tin playlist"
                                    onClick={() => {
                                        setIsEditModalOpen(true);
                                        setIsModalOpen(false);
                                    }}
                                    outline
                                />

                                <Button
                                    label="Xóa playlist này"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setIsDelPlaylistModalOpen(true);
                                    }}
                                    outline
                                />
                            </>
                        )}

                    <Button
                        label="Copy link playlist"
                        onClick={() => {
                            navigator.clipboard.writeText(
                                `https://${window.location.hostname}/playlists/${playlist.id}`,
                            );
                            toast.success("Đã copy link playlist");
                            setIsModalOpen(false);
                        }}
                        outline
                    />
                </div>
            </Modal>

            {/* Delete playlist modal */}
            <Modal
                isOpen={isDelPlaylistModalOpen}
                onClickClose={() => {
                    setIsDelPlaylistModalOpen(false);
                }}
                actionButton={
                    <button
                        onClick={handleDeletePlaylist}
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-error px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    >
                        Xóa
                    </button>
                }
            >
                <DeleteConfirmContent
                    title="Xóa playlist này?"
                    body="Bạn có chắc muốn xóa playlist này không?"
                />
            </Modal>

            <div className="bg-darkgray rounded-lg p-10">
                <div className="w-full lg:max-w-full md:flex mb-5 relative">
                    <Image
                        className="w-full md:max-w-[150px] md:max-h-[150px] max-h-[250px] object-cover"
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
                                {playlist.status === "PRIVATE" && (
                                    <span className="text-error ml-2">
                                        (riêng tư)
                                    </span>
                                )}
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
                    <PlayButton
                        songs={playlist.songs ?? []}
                        playlistId={playlist.id}
                    />

                    {session?.user?.id !== playlist.user.id && (
                        <LikePlaylistButton playlistId={playlist.id} />
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
                    <div className="text-gray-500 whitespace-pre-wrap">
                        <p className="text-yellow-50">Description:</p>
                        {playlist.description}
                    </div>
                )}
            </div>
        </>
    );
}
