import { BACKEND_API_URL } from "@/libs/constants";
import { Account, AccountQuery } from "@/types/user";
import callAPI from "../callApi";
import { PagedResponse } from "@/types/paging";

export async function getAccounts(query: AccountQuery, accessToken: string) {
    const params = new URLSearchParams({
        ...query as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/accounts?${params}`, {
        accessToken
    });

    if (!response.ok) return null;

    const data = await response.json();

    return data as PagedResponse<Account>;
}

export async function getAccountById(
    userId: string, 
    accessToken: string
) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/accounts/${userId}`, {
        accessToken
    });

    if (!response.ok) return null;

    const data = await response.json();

    return data as Account;
}

export async function updateAccountState(
    userId: string,
    request: { locked: boolean },
    accessToken: string
) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/accounts/${userId}`, {
        method: "PATCH",
        contentType: "application/json",
        accessToken,
        body: JSON.stringify({ ...request })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return data as Account;
}

export async function deleteAccount(
    userId: string, 
    accessToken: string
) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/accounts/${userId}`, {
        method: "DELETE",
        accessToken
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return data as Account;
}