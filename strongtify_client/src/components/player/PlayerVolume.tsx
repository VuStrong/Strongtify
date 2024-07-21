"use client";

import * as RadixSlider from "@radix-ui/react-slider";
import { useMemo } from "react";
import { LuVolumeX, LuVolume1, LuVolume2 } from "react-icons/lu";

export default function PlayerVolume({
    volume,
    onVolumeChange,
    onMute,
    onUnmute,
}: {
    volume: number;
    onVolumeChange: (volume: number) => void;
    onMute: () => void,
    onUnmute: () => void,
}) {
    const VolumeIcon = useMemo(() => {
        if (volume <= 0) {
            return (
                <LuVolumeX
                    title="Bật tiếng"
                    size={25}
                    className="text-neutral-400 cursor-pointer hover:text-white transition mr-2"
                    onClick={onUnmute}
                />
            );
        }
    
        if (volume >= 0.5) {
            return (
                <LuVolume2
                    title="Tắt tiếng"
                    size={25}
                    className="text-neutral-400 cursor-pointer hover:text-white transition mr-2"
                    onClick={onMute}
                />
            );
        }
    
        return (
            <LuVolume1
                title="Tắt tiếng"
                size={25}
                className="text-neutral-400 cursor-pointer hover:text-white transition mr-2"
                onClick={onMute}
            />
        );
    }, [volume]);

    return (
        <div className="flex items-center">
            {VolumeIcon}

            <RadixSlider.Root
                className="relative flex items-center select-none touch-none w-[100px] cursor-pointer"
                defaultValue={[1]}
                value={[volume]}
                onValueChange={(newValue: number[]) => {
                    onVolumeChange(newValue[0]);
                }}
                min={0}
                max={1}
                step={0.1}
            >
                <RadixSlider.Track className="bg-neutral-600 relative grow rounded-full h-[3px] hover:h-[6px]">
                    <RadixSlider.Range className="absolute bg-white rounded-full h-full" />
                </RadixSlider.Track>

                <RadixSlider.Thumb className="block w-[10px] h-[10px] bg-white rounded-full hover:scale-125" />
            </RadixSlider.Root>
        </div>
    );
}
