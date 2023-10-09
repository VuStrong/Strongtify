"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import usePlayer from "@/hooks/usePlayer";
import { NO_IMAGE_URL } from "@/libs/constants";
import Slider from "./Slider";
import { SongDetail } from "@/types/song";

export default function PlayerContent({ song }: { song: SongDetail }) {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isDrag, setIsDrag] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const player = usePlayer();

    useEffect(() => {
        audioRef.current?.play();
    }, [audioRef.current]);

    const onPlayNext = useCallback(() => {
        if (!player.ids[0]) {
            return;
        }

        if (player.currentIndex >= player.ids.length - 1) {
            player.setCurrentIndex(0);
        } else {
            player.setCurrentIndex(player.currentIndex + 1)
        }
    }, [player]);

    const onPlayPrevious = useCallback(() => {
        if (!player.ids[0]) {
            return;
        }

        if (player.currentIndex <= 0) {
            player.setCurrentIndex(player.ids.length - 1);
        } else {
            player.setCurrentIndex(player.currentIndex - 1);
        }
    }, [player]);

    const handlePlay = useCallback(() => {
        if (!isPlaying) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
    }, [isPlaying, audioRef]);

    const onTimeUpdate = useCallback(() => {
        if (audioRef.current && !isDrag) {
            setProgress(audioRef.current.currentTime / audioRef.current.duration * 100);
        }
    }, [isDrag, audioRef]);

    return (
        <>
            <div className="absolute top-0 left-0 w-full">
                <Slider 
                    value={progress}
                    onChange={(value) => {
                        setIsDrag(true);
                        setProgress(value);
                    }}
                    onCommit={(value) => { 
                        if (audioRef.current) {
                            audioRef.current.currentTime = value / 100 * audioRef.current.duration;
                        }

                        setIsDrag(false);
                    }}
                />
            </div>

            <audio 
                id="audio" 
                ref={audioRef} 
                src={song.songUrl}
                onTimeUpdate={onTimeUpdate}
                onPlay={() => { setIsPlaying(true) }}
                onPause={() => { setIsPlaying(false) }}
                onEnded={() => {
                    setIsPlaying(false);
                    onPlayNext();
                }}
            ></audio>

            <div className="grid grid-cols-2 md:grid-cols-3 h-full">
                <div className="flex w-full justify-start gap-x-3">
                    <Image
                        src={song.imageUrl ?? NO_IMAGE_URL}
                        width={50}
                        height={50}
                        alt={song.name}
                    />

                    <div className="flex-1 truncate">
                        <Link
                            href={`/songs/${song.alias}/${song.id}`}
                            className="hover:underline text-yellow-50"
                        >
                            {song.name}
                        </Link>

                        <div className="text-gray-400 text-sm">
                            {song.artists?.map((artist) => (
                                <Link
                                    href={`/artists/${artist.alias}/${artist.id}`}
                                    className="hover:underline"
                                    key={artist.id}
                                >
                                    {artist.name}
                                    <span>, </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="h-full flex justify-center items-center w-full max-w-[722px] gap-x-6">
                    <AiFillStepBackward
                        onClick={onPlayPrevious}
                        size={30}
                        className="text-neutral-400 cursor-pointer hover:text-white transition"
                    />

                    <div
                        onClick={handlePlay}
                        className="flex items-center justify-center h-10 w-10 rounded-full  bg-white p-1 cursor-pointer"
                    >
                        {isPlaying ? (
                            <BsPauseFill size={30} className="text-black" />
                        ) : (
                            <BsPlayFill size={30} className="text-black" />
                        )}
                    </div>

                    <AiFillStepForward
                        onClick={onPlayNext}
                        size={30}
                        className="text-neutral-400 cursor-pointer  hover:text-white transition"
                    />
                </div>
            </div>
        </>
    );
}
