import { BACKEND_API_URL } from "@/libs/constants";
import { User, UserDetail, UserDetailQuery } from "@/types/user";
import callAPI from "../callApi";
import { PagedResponse, PagingQuery } from "@/types/paging";
import { Artist } from "@/types/artist";

export async function getUsers(query: PagingQuery) {
    const params = new URLSearchParams({
        ...query as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/users?${params}`);

    if (!response.ok) return null;

    const data = await response.json();

    return data as PagedResponse<User>;
}

export async function getUserById(
    userId: string, 
    query?: UserDetailQuery,
    accessToken?: string
) {
    const params = query && new URLSearchParams({
        ...query as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/users/${userId}?${params ?? ""}`, {
        accessToken
    });

    if (!response.ok) return null;

    const data = await response.json();

    return data as UserDetail;
}

export async function checkFollowingUser(userId: string, idToCheck: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/users/${userId}/following-users/${idToCheck}`, {
        method: "HEAD"
    });

    return response.ok;
}

export async function checkFollowingArtist(userId: string, artistId: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/users/${userId}/following-artists/${artistId}`, {
        method: "HEAD"
    });

    return response.ok;
}

export async function getFollowingUsers(userId: string, query: PagingQuery) {
    const params = new URLSearchParams({
        ...query as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/users/${userId}/following-users?${params}`);

    if (!response.ok) return null;

    const data = await response.json();

    return data as PagedResponse<User>;
}

export async function getFollowers(userId: string, query: PagingQuery) {
    const params = new URLSearchParams({
        ...query as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/users/${userId}/followers?${params}`);

    if (!response.ok) return null;

    const data = await response.json();

    return data as PagedResponse<User>;
}

export async function getFollowingArtists(userId: string, query: PagingQuery) {
    const params = new URLSearchParams({
        ...query as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/users/${userId}/following-artists?${params}`);

    if (!response.ok) return null;

    const data = await response.json();

    return data as PagedResponse<Artist>;
}