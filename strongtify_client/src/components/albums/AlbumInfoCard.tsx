"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import toast from "react-hot-toast";

import { DEFAULT_AVATAR_URL, NO_IMAGE_URL } from "@/libs/constants";
import { formatLength } from "@/libs/utils";
import PlayButton from "../buttons/PlayButton";
import Modal from "../modals/Modal";
import Button from "../buttons/Button";
import { AlbumDetail } from "@/types/album";
import LikeAlbumButton from "../buttons/LikeAlbumButton";

export default function AlbumInfoCard({ album }: { album: AlbumDetail }) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const songIds = useMemo(() => album.songs?.map(s => s.id), [album.songs]);

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
                        label="Copy link album"
                        onClick={() => {
                            navigator.clipboard.writeText(
                                `https://${window.location.hostname}/albums/${album.alias}/${album.id}`,
                            );
                            toast.success("Đã copy link album");
                            setIsModalOpen(false);
                        }}
                        outline
                    />
                </div>
            </Modal>

            <div className="bg-darkgray rounded-lg p-10">
                <div className="w-full lg:max-w-full md:flex mb-5">
                    <Image
                        className="w-full md:w-auto md:max-h-[150px] max-h-[250px] object-cover"
                        width={150}
                        height={150}
                        src={album.imageUrl ?? NO_IMAGE_URL}
                        alt={album.name}
                    />

                    <div className="p-4 md:pt-0 flex flex-col justify-between leading-normal">
                        <div className="md:mb-3">
                            <p className="text-sm text-yellow-100 flex items-center">
                                Album
                            </p>
                            <div className="text-yellow-50 font-bold text-3xl mb-2">
                                {album.name}
                            </div>

                            {album.artist && (
                                <div className="flex gap-2 mb-3">
                                    <Image
                                        className="rounded-full"
                                        width={28}
                                        height={28}
                                        src={
                                            album.artist.imageUrl ??
                                            DEFAULT_AVATAR_URL
                                        }
                                        alt={album.artist.name}
                                    />
                                    <Link
                                        href={`/artists/${album.artist.alias}/${album.artist.id}`}
                                        className="text-gray-500 text-base truncate hover:underline"
                                    >
                                        {album.artist.name}
                                    </Link>
                                </div>
                            )}

                            <div className="text-gray-300">
                                {album.songCount} bài hát
                                <span> - </span>
                                {formatLength(album.totalLength)}
                            </div>
                            <div className="text-gray-400">
                                {album.likeCount} lượt thích
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 items-center">
                    <PlayButton songIds={songIds} />

                    <div>
                        <LikeAlbumButton albumId={album.id} />
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
