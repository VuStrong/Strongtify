"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { FieldErrors } from "react-hook-form";

export default function ImageInput({
    id,
    disabled,
    src,
    width,
    height,
    onImageChange,
    errors,
}: {
    id: string;
    disabled?: boolean;
    src: string;
    width: number;
    height: number;
    onImageChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    errors?: FieldErrors;
}) {
    const [isHiding, setIsHiding] = useState<boolean>(true);

    return (
        <div
            className="relative h-full"
            onMouseOver={() => setIsHiding(false)}
            onMouseOut={() => setIsHiding(true)}
        >
            <Image
                className="rounded-lg mb-2 object-cover w-full h-full"
                src={src}
                alt="avatar"
                width={width}
                height={height}
            />

            {errors && errors[id] && (
                <div className="text-error text-sm">
                    {errors[id]?.message as string}
                </div>
            )}

            {!isHiding && (
                <div className="bg-black bg-opacity-50 absolute w-full h-full top-0 left-0 flex justify-center items-center">
                    <label
                        htmlFor={id}
                        className="bg-white rounded-md px-2 hover:bg-gray-300"
                    >
                        Chọn ảnh
                    </label>
                    <input
                        id={id}
                        type="file"
                        hidden
                        disabled={disabled}
                        onChange={onImageChange}
                    />
                </div>
            )}
        </div>
    );
}
