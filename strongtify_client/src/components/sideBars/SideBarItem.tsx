"use client";

import Link from "next/link";
import { IconType } from "react-icons";

interface SideBarItemProps {
    name: string;
    icon: IconType;
    href: string;
    active: boolean;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const SideBarItem: React.FC<SideBarItemProps> = ({
    name,
    icon: Icon,
    href,
    active,
    onClick,
}) => {
    return (
        <li>
            <Link
                href={href}
                className={`
                    flex
                    gap-x-5
                    text-lg
                    ${active ? "font-bold" : "font-normal"}
                    ${active ? "text-primary" : "text-gray-400"}
                `}
                onClick={onClick}
            >
                <Icon size={24} />
                <span>{name}</span>
            </Link>
        </li>
    );
};

export default SideBarItem;
