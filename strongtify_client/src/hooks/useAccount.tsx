'use client'

import { getAccount } from "@/services/api/me";
import { Account } from "@/types/user";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useAccount(): {
    account: Account | undefined,
    isLoading: boolean
} {
    const [account, setAccount] = useState<Account>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { data: session, status } = useSession();
    
    useEffect(() => {
        if (status === "authenticated") {
            const getAccountFunc = async () => {
                const result = await getAccount(session.accessToken);

                if (result !== null) {
                    setAccount(result);
                }

                setIsLoading(false);
            }

            getAccountFunc();
        } else if(status === "unauthenticated") {
            setAccount(undefined);
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }
    }, [status, session]);

    return {
        account,
        isLoading
    };
}