"use client";

import { refreshAccessToken } from "@/services/api/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReSignInHandler({
    userId,
    refreshToken,
    redirectAfterUpdate,
}: {
    userId: string;
    refreshToken: string;
    redirectAfterUpdate: boolean;
}) {
    const router = useRouter();

    useEffect(() => {
        const refresh = async () => {
            const response = await refreshAccessToken(userId, refreshToken);

            await signIn("access-token", {
                accessToken: response.access_token,
                refreshToken: response.refresh_token,
                redirect: false,
            });

            if (redirectAfterUpdate) {
                router.refresh();
                router.push("/");
            }
        };

        refresh();
    }, []);

    return <></>;
}
