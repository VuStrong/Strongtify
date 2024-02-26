"use client";

import Image from "next/image";
import Link from "next/link";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import usePlayer from "@/hooks/usePlayer";
import { NO_IMAGE_URL } from "@/libs/constants";
import Slider from "./Slider";
import { Song } from "@/types/song";
import { increaseListenCount } from "@/services/api/songs";
import LikeSongButton from "../buttons/LikeSongButton";

export default function PlayerContent({ song }: { song?: Song }) {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isDrag, setIsDrag] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const player = usePlayer();

    const onPlayNext = useCallback(() => {
        if (!player.songs[0]) {
            return;
        }

        const length = player.songs.length;
        const currentIndex = player.songs.findIndex(
            (s) => s.id == player.playingSong?.id,
        );
        const nextIndex = currentIndex >= length - 1 ? 0 : currentIndex + 1;

        player.setPlayingSong(player.songs[nextIndex]);
    }, [player]);

    const onPlayPrevious = useCallback(() => {
        if (!player.songs[0]) {
            return;
        }

        const length = player.songs.length;
        const currentIndex = player.songs.findIndex(
            (s) => s.id == player.playingSong?.id,
        );
        const prevIndex = currentIndex <= 0 ? length - 1 : currentIndex - 1;

        player.setPlayingSong(player.songs[prevIndex]);
    }, [player]);

    const handlePlay = useCallback(() => {
        if (!isPlaying) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
    }, [isPlaying, audioRef.current]);

    // Call when audio update time to update slider's progress
    const onTimeUpdate = useCallback(() => {
        if (audioRef.current && !isDrag) {
            setProgress(
                (audioRef.current.currentTime / audioRef.current.duration) *
                    100,
            );
        }
    }, [isDrag, audioRef.current]);

    // Call when audio can start playing
    const onCanPlay = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.play();

            const listen = async () => {
                if (song) await increaseListenCount(song.id);
            };

            listen();
        }
    }, [audioRef.current, song]);

    // Call when audio play
    const onPlay = useCallback(() => {
        setIsPlaying(true);

        if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = "playing";
        }
    }, []);

    // Call when audio paused
    const onPause = useCallback(() => {
        setIsPlaying(false);

        if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = "paused";
        }
    }, []);

    const onSliderValueChange = useCallback((value: number) => {
        setIsDrag(true);
        setProgress(value);
    }, []);

    const onSliderValueCommit = useCallback(
        (value: number) => {
            if (audioRef.current) {
                audioRef.current.currentTime =
                    (value / 100) * audioRef.current.duration;
            }

            setIsDrag(false);
        },
        [audioRef.current],
    );

    // Change MediaSession if song changed
    useEffect(() => {
        if (!song) return;

        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.name,
                artist: song.artists?.map((a) => a.name).join(", "),
                artwork: song.imageUrl ? [{ src: song.imageUrl }] : undefined,
            });
        }
    }, [song]);

    // Declare Media Session action handlers
    useEffect(() => {
        if (!("mediaSession" in navigator)) return;

        navigator.mediaSession.setActionHandler("play", () => {
            audioRef.current?.play();
        });

        navigator.mediaSession.setActionHandler("pause", () => {
            audioRef.current?.pause();
        });

        navigator.mediaSession.setActionHandler("seekbackward", () => {
            onPlayPrevious();
        });

        navigator.mediaSession.setActionHandler("seekforward", () => {
            onPlayNext();
        });

        navigator.mediaSession.setActionHandler("previoustrack", () => {
            onPlayPrevious();
        });

        navigator.mediaSession.setActionHandler("nexttrack", () => {
            onPlayNext();
        });

        navigator.mediaSession.setActionHandler("seekto", (details) => {
            if (audioRef.current) {
                audioRef.current.currentTime = details.seekTime ?? 0;
            }
        });
    }, [player]);

    return (
        <>
            <div className="absolute top-0 left-0 w-full">
                <Slider
                    value={progress}
                    onChange={onSliderValueChange}
                    onCommit={onSliderValueCommit}
                />
            </div>

            <audio
                id="audio"
                ref={audioRef}
                src={song?.songUrl ?? ""}
                onTimeUpdate={onTimeUpdate}
                onPlay={onPlay}
                onPause={onPause}
                onEnded={onPlayNext}
                onCanPlay={onCanPlay}
            ></audio>

            {song ? (
                <div className="grid grid-cols-2 md:grid-cols-3 h-full">
                    <div className="flex w-full justify-start gap-x-3">
                        <div className="hidden md:block">
                            <LikeSongButton songId={song.id} />
                        </div>

                        <Image
                            src={song.imageUrl ?? NO_IMAGE_URL}
                            width={50}
                            height={50}
                            alt={song.name}
                        />

                        <div className="flex-1 truncate">
                            <Link
                                href={player.path ?? "#"}
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
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 h-full">
                    <div className="flex w-full justify-start gap-x-3">
                        <Skeleton
                            width={50}
                            height={50}
                            highlightColor="#f58c1b"
                            baseColor="#4d4c49"
                        />

                        <div className="flex-1 truncate">
                            <div>
                                <Skeleton
                                    highlightColor="#f58c1b"
                                    count={2}
                                    baseColor="#4d4c49"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-full flex justify-center items-center w-full max-w-[722px] gap-x-6">
                        <AiFillStepBackward
                            size={30}
                            className="text-neutral-400 cursor-pointer hover:text-white transition"
                        />

                        <div className="flex items-center justify-center h-10 w-10 rounded-full  bg-white p-1 cursor-pointer">
                            <BsPlayFill size={30} className="text-black" />
                        </div>

                        <AiFillStepForward
                            size={30}
                            className="text-neutral-400 cursor-pointer  hover:text-white transition"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
