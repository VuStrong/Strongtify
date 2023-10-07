"use client";

import { useState } from "react";
import Button from "./Button";
import { reSendEmailConfirmationToken } from "@/services/api/auth";
import { toast } from "react-hot-toast";

export default function SendEmailConfirmationButton({
    accessToken,
}: {
    accessToken: string;
}) {
    const [isSending, setIsSending] = useState<boolean>(false);

    const handleSendEmailConfirmation = async () => {
        setIsSending(true);
        await reSendEmailConfirmationToken(accessToken).catch(() => undefined);
        setIsSending(false);
        toast.success("Gửi mã xác thực thành công");
    };

    return (
        <Button
            disabled={isSending}
            label={isSending ? "Đang gửi" : "Gửi lại mã xác thực"}
            onClick={handleSendEmailConfirmation}
        />
    );
}
