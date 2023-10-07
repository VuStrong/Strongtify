import { CreateUpdatePlaylistRequest, CudPlaylistResponse, Playlist, PlaylistDetail, PlaylistQuery } from "@/types/playlist";
import callAPI from "../callApi";
import { BACKEND_API_URL } from "@/libs/constants";
import { PagedResponse, PagingQuery } from "@/types/paging";

export async function getPlaylists(query?: PlaylistQuery, accessToken?: string) {
    const params = query && new URLSearchParams({
        ...query as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/playlists?${params ?? ""}`, {
        accessToken
    });

    if (!response.ok) return null;

    const data = await response.json();

    return data as PagedResponse<Playlist>;
}

export async function searchPlaylists(value: string, query: PagingQuery) {
    const params = new URLSearchParams({
        q: value,
        ...query as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/playlists/search?${params}`);

    if (!response.ok) return null;

    const data = await response.json();

    return data as PagedResponse<Playlist>;
}

export async function getPlaylistById(playlistId: string, accessToken?: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/playlists/${playlistId}`, {
        accessToken
    });

    if (!response.ok) return null;

    const data = await response.json();

    return data as PlaylistDetail;
}

export async function createPlaylist(
    request: CreateUpdatePlaylistRequest,
    accessToken: string
) {
    const formData = new FormData();

    formData.append("name", request.name);
    formData.append("status", request.status);
    if (request.description) formData.append("description", request.description);
    if (request.image) formData.append("image", request.image);

    const response = await callAPI(`${BACKEND_API_URL}/v1/playlists`, {
        method: "POST",
        accessToken,
        body: formData
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return data as CudPlaylistResponse;
}

export async function updatePlaylist(
    playlistId: string, 
    request: CreateUpdatePlaylistRequest,
    accessToken: string
) {
    const formData = new FormData();

    formData.append("name", request.name);
    formData.append("status", request.status);
    if (request.description) formData.append("description", request.description);
    if (request.image) formData.append("image", request.image);

    const response = await callAPI(`${BACKEND_API_URL}/v1/playlists/${playlistId}`, {
        method: "PUT",
        accessToken,
        body: formData
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return data as CudPlaylistResponse;
}

export async function deletePlaylist(playlistId: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/playlists/${playlistId}`, {
        method: "DELETE",
        accessToken
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return data as CudPlaylistResponse;
}

export async function moveSongInPlaylist(
    playlistId: string, 
    songId: string, 
    to: number,
    accessToken: string
) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/playlists/${playlistId}/songs/${songId}`, {
        method: "PUT",
        accessToken,
        contentType: "application/json",
        body: JSON.stringify({ to })
    });

    return response.ok;
}

export async function addSongsToPlaylist(
    playlistId: string, 
    songIds: string[], 
    accessToken: string
) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/playlists/${playlistId}/songs`, {
        method: "POST",
        accessToken,
        contentType: "application/json",
        body: JSON.stringify({ songIds })
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return true;
}

export async function removeSongFromPlaylist(
    playlistId: string, 
    songId: string, 
    accessToken: string
) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/playlists/${playlistId}/songs/${songId}`, {
        method: "DELETE",
        accessToken,
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return true;
}
