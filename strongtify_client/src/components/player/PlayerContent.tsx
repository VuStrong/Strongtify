"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import { useEffect, useRef, useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { MdQueueMusic } from "react-icons/md";
import usePlayer from "@/hooks/store/usePlayer";
import { NO_IMAGE_URL } from "@/libs/constants";
import PlayerProgressBar from "./PlayerProgressBar";
import { Song } from "@/types/song";
import { increaseListenCount } from "@/services/api/songs";
import LikeSongButton from "../buttons/LikeSongButton";
import PlayerVolume from "./PlayerVolume";
import useModal from "@/hooks/store/useModal";

export default function PlayerContent({ song }: { song?: Song }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isDraggingProgressBar, setIsDraggingProgressBar] =
        useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [volume, setVolume] = useState<number>(1);

    const player = usePlayer();
    const songQueueModal = useModal(state => state.songQueueModal);

    const { data: session } = useSession();

    const onPlayNext = player.next;

    const onPlayPrevious = player.prev;

    const onClickPlay = () => {
        if (!isPlaying) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
    };

    // Call when volume bar changed
    const onVolumeBarChange = (volume: number) => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    };

    const onMute = () => {
        if (audioRef.current) {
            audioRef.current.volume = 0;
        }
    };

    const onUnmute = () => {
        if (audioRef.current) {
            audioRef.current.volume = 1;
        }
    };

    const onProgressBarValueChange = (value: number) => {
        setIsDraggingProgressBar(true);
        setProgress(value);
    };

    const onProgressBarValueCommit = (value: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime =
                (value / 100) * audioRef.current.duration;
        }

        setIsDraggingProgressBar(false);
    };

    // Call when audio update time to update slider's progress
    const onAudioTimeUpdate = () => {
        if (audioRef.current && !isDraggingProgressBar) {
            setProgress(
                (audioRef.current.currentTime / audioRef.current.duration) *
                    100,
            );
        }
    };

    // Call when audio can start playing
    const onAudioCanPlay = () => {
        if (audioRef.current) {
            audioRef.current.play();

            if (song) increaseListenCount(song.id, session?.accessToken);
        }
    };

    // Call when audio play
    const onAudioPlay = () => {
        setIsPlaying(true);

        if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = "playing";
        }
    };

    // Call when audio paused
    const onAudioPause = () => {
        setIsPlaying(false);

        if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = "paused";
        }
    };

    const onAudioVolumeChange = () => {
        if (audioRef.current) {
            setVolume(audioRef.current.volume);
        }
    };

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
            if (audioRef.current) {
                audioRef.current.currentTime -= 10;
            }
        });

        navigator.mediaSession.setActionHandler("seekforward", () => {
            if (audioRef.current) {
                audioRef.current.currentTime += 10;
            }
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
        <div className="bg-orange-800 px-4 py-3">
            <div className="absolute top-0 left-0 w-full">
                <PlayerProgressBar
                    value={progress}
                    onChange={onProgressBarValueChange}
                    onCommit={onProgressBarValueCommit}
                />
            </div>

            <audio
                id="audio"
                ref={audioRef}
                src={song?.songUrl ?? ""}
                onTimeUpdate={onAudioTimeUpdate}
                onPlay={onAudioPlay}
                onPause={onAudioPause}
                onEnded={onPlayNext}
                onCanPlay={onAudioCanPlay}
                onVolumeChange={onAudioVolumeChange}
            ></audio>

            {song ? (
                <div className="flex items-center justify-between h-full">
                    <div className="flex justify-start items-center w-[60%] md:w-[30%] gap-x-3">
                        <div className="hidden md:flex items-center">
                            <LikeSongButton songId={song.id} size={40} />
                        </div>

                        <Image
                            src={song.imageUrl ?? NO_IMAGE_URL}
                            width={50}
                            height={50}
                            alt={song.name}
                        />

                        <div className="flex-1 truncate">
                            <Link
                                href={
                                    player.path
                                        ? `${player.path}#${player.playingSong?.id}`
                                        : "#"
                                }
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

                    <div className="h-full flex justify-center items-center w-[40%] max-w-[722px] gap-x-6">
                        <AiFillStepBackward
                            onClick={onPlayPrevious}
                            size={30}
                            className="text-neutral-400 cursor-pointer hover:text-white transition"
                        />

                        <div
                            onClick={onClickPlay}
                            className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
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
                            className="text-neutral-400 cursor-pointer hover:text-white transition"
                        />
                    </div>

                    <div className="hidden md:flex justify-end items-center w-[30%] gap-x-3">
                        <MdQueueMusic
                            title="Danh sách chờ"
                            size={25}
                            className="text-neutral-400 cursor-pointer hover:text-white transition"
                            onClick={songQueueModal.open}
                        />

                        <PlayerVolume
                            volume={volume}
                            onVolumeChange={onVolumeBarChange}
                            onMute={onMute}
                            onUnmute={onUnmute}
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
        </div>
    );
}
