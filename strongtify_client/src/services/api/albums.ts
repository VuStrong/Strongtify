import { BACKEND_API_URL } from "@/libs/constants";
import callAPI from "../callApi";
import { PagedResponse, PagingQuery } from "@/types/paging";
import { Album, AlbumDetail, AlbumQuery, CreateUpdateAlbumRequest, CudAlbumResponse } from "@/types/album";

export async function getAlbums(query: AlbumQuery) {
    const params = new URLSearchParams({
        ...query as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/albums?${params}`);

    if (!response.ok) return null;

    const data = await response.json();

    return data as PagedResponse<Album>;
}

export async function searchAlbums(value: string, query: PagingQuery) {
    const params = new URLSearchParams({
        q: value,
        ...query as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/albums/search?${params}`);

    if (!response.ok) return null;

    const data = await response.json();

    return data as PagedResponse<Album>;
}

export async function getAlbumById(albumId: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/albums/${albumId}`);

    if (!response.ok) return null;

    const data = await response.json();

    return data as AlbumDetail;
}

export async function createAlbum(request: CreateUpdateAlbumRequest, accessToken: string) {
    const formData = new FormData();

    formData.append("name", request.name);
    if (request.image) formData.append("image", request.image);
    if (request.artistId) formData.append("artistId", request.artistId);

    request.genreIds?.forEach(g => {
        formData.append("genreIds", g);
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/albums`, {
        method: "POST",
        accessToken,
        body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return data as CudAlbumResponse;
}

export async function updateAlbum(
    albumId: string, 
    request: CreateUpdateAlbumRequest, 
    accessToken: string
) {
    const formData = new FormData();

    formData.append("name", request.name);
    if (request.image) formData.append("image", request.image);
    if (request.artistId) formData.append("artistId", request.artistId);
    
    request.genreIds?.forEach(g => {
        formData.append("genreIds", g);
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/albums/${albumId}`, {
        method: "PUT",
        accessToken,
        body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return data as CudAlbumResponse;
}

export async function deleteAlbum(albumId: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/albums/${albumId}`, {
        method: "DELETE",
        accessToken
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return data as CudAlbumResponse;
}

export async function moveSongInAlbum(
    albumId: string, 
    songId: string, 
    to: number,
    accessToken: string
) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/albums/${albumId}/songs/${songId}`, {
        method: "PUT",
        accessToken,
        contentType: "application/json",
        body: JSON.stringify({ to })
    });

    return response.ok;
}

export async function addSongsToAlbum(
    albumId: string, 
    songIds: string[], 
    accessToken: string
) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/albums/${albumId}/songs`, {
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

export async function removeSongFromAlbum(
    albumId: string, 
    songId: string, 
    accessToken: string
) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/albums/${albumId}/songs/${songId}`, {
        method: "DELETE",
        accessToken,
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return true;
}