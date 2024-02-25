"use client";

import Button from "./Button";
import { logout } from "@/services/api/auth";
import { signOut } from "next-auth/react";

export default function SignOutButton({
    accessToken,
    refreshToken,
}: {
    accessToken: string;
    refreshToken: string;
}) {
    const handleLogout = async () => {
        await logout(refreshToken, accessToken);
        signOut();
    };

    return <Button outline label="Đăng xuất" onClick={handleLogout} />;
}
