"use client";

import { useCallback, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { DotLoader } from "react-spinners";

export default function AddButton({
    size,
    onClick,
}: {
    size: number;
    onClick: () => Promise<void>;
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleClick = useCallback(async () => {
        setIsLoading(true);

        await onClick();

        setIsLoading(false);
    }, [onClick]);

    return (
        <button
            disabled={isLoading}
            onClick={handleClick}
            className="bg-success rounded-full p-1 text-black"
        >
            {isLoading ? (
                <DotLoader size={size} color="#121212" />
            ) : (
                <AiOutlinePlus size={size} />
            )}
        </button>
    );
}
