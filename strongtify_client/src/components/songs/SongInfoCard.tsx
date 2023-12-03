"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import toast from "react-hot-toast";

import { SongDetail } from "@/types/song";
import { NO_IMAGE_URL } from "@/libs/constants";
import { formatLength } from "@/libs/utils";
import PlayButton from "../buttons/PlayButton";
import LikeSongButton from "../buttons/LikeSongButton";
import Modal from "../modals/Modal";
import Button from "../buttons/Button";
import PlaylistContent from "../modals/modal-contents/PlaylistContent";
import { addSongsToPlaylist } from "@/services/api/playlists";

export default function SongInfoCard({ song }: { song: SongDetail }) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
        useState<boolean>(false);
    const { data: session } = useSession();

    return (
        <>
            <Modal
                isOpen={isModalOpen}
                onClickClose={() => {
                    setIsModalOpen(false);
                }}
            >
                <div className="text-yellow-50 p-4 flex flex-col gap-3">
                    <Button
                        label="Copy link bài hát"
                        onClick={() => {
                            navigator.clipboard.writeText(
                                `https://${window.location.hostname}/songs/${song.alias}/${song.id}`,
                            );
                            toast.success("Đã copy link bài hát");
                            setIsModalOpen(false);
                        }}
                        outline
                    />

                    <a
                        className="relative rounded-lg hover:opacity-80 transition w-full p-3 text-md font-semibold border-gray-300 border-2 text-gray-300 text-center"
                        href={song.songUrl ?? "#"}
                        target="_blank"
                        onClick={() => { setIsModalOpen(false) }}
                    >
                        Tải về bài hát
                    </a>

                    <Button
                        label="Thêm vào danh sách phát"
                        onClick={() => {
                            setIsModalOpen(false);
                            setIsAddToPlaylistModalOpen(true);
                        }}
                        outline
                    />
                </div>
            </Modal>

            <Modal
                isOpen={isAddToPlaylistModalOpen}
                onClickClose={() => {
                    setIsAddToPlaylistModalOpen(false);
                }}
            >
                <PlaylistContent
                    onClickPlaylist={async (playlistId: string) => {
                        setIsAddToPlaylistModalOpen(false);

                        const addTask = async () => {
                            await addSongsToPlaylist(
                                playlistId,
                                [song.id],
                                session?.accessToken ?? "",
                            );
                        }

                        toast.promise(addTask(), {
                            loading: "Đang thêm bài hát",
                            success: "Đã thêm bài hát vào danh sách phát",
                            error: (e) => {
                                return e.message;
                            }
                        });
                    }}
                />
            </Modal>

            <div className="bg-darkgray rounded-lg p-10">
                <div className="w-full lg:max-w-full md:flex mb-5">
                    <Image
                        className="w-full md:w-auto md:max-h-[150px] max-h-[250px] object-cover"
                        width={150}
                        height={150}
                        src={song.imageUrl ?? NO_IMAGE_URL}
                        alt={song.name}
                    />

                    <div className="p-4 flex flex-col justify-between leading-normal">
                        <div className="md:mb-3">
                            <p className="text-sm text-yellow-100 flex items-center">
                                Bài hát
                            </p>
                            <div className="text-yellow-50 font-bold text-3xl mb-2">
                                {song.name}
                            </div>
                            <div className="text-gray-300">
                                <span
                                    title={`${song.releasedAt?.split("T")[0]}`}
                                >
                                    {song.releasedAt &&
                                        new Date(song.releasedAt).getFullYear()}
                                </span>

                                <span className="font-bold"> - </span>

                                {formatLength(song.length)}
                            </div>
                            <div className="text-gray-400">
                                {song.listenCount} lượt nghe - {song.likeCount}{" "}
                                lượt thích
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 items-center">
                    <PlayButton songIds={[song.id]} />

                    <div>
                        <LikeSongButton songId={song.id} />
                    </div>

                    <div
                        className="w-fit text-3xl text-gray-300 cursor-pointer hover:text-white"
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                    >
                        <BsThreeDots />
                    </div>
                </div>
            </div>
        </>
    );
}
