"use client";

import { IconType } from "react-icons";

interface ButtonProps {
    label: string | React.ReactNode;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    outline?: boolean;
    type?: "button" | "submit";
    icon?: IconType;
    bgType?: "primary" | "error" | "success";
}

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    disabled,
    outline,
    type = "button",
    icon: Icon,
    bgType = "primary",
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                relative
                disabled:opacity-70
                disabled:cursor-not-allowed
                rounded-lg
                hover:opacity-80
                transition
                w-full
                p-3
                text-md
                font-semibold
                ${outline ? "text-gray-300" : "text-black"}
                ${outline ? "bg-transparent" : `bg-${bgType}`}
                ${outline && "border-gray-300 border-2"}
            `}
        >
            {Icon && (
                <Icon
                    size={24}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                />
            )}
            {label}
        </button>
    );
};

export default Button;
