import { BACKEND_API_URL } from "@/libs/constants";
import callAPI from "../callApi";
import { SearchResponse, Section } from "@/types/common";

export async function getHomeSections(accessToken?: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/sections`, {
        accessToken
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data as Section[];
}

export async function search(query: {
    q: string,
    take: number,
    allowCount: boolean
}) {
    const params = new URLSearchParams({
        ...query as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/search?${params}`);

    if (!response.ok) return null;

    const data = await response.json();
    return data as SearchResponse;
}