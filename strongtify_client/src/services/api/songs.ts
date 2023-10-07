import { PagedResponse, PagingQuery } from "@/types/paging";
import { CreateUpdateSongRequest, CudSongResponse, Song, SongDetail, SongQuery, TopSong } from "@/types/song";
import { BACKEND_API_URL } from "@/libs/constants";
import callAPI from "../callApi";

export async function getSongs(query: SongQuery) {
    const params = new URLSearchParams({
        ...query as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/songs?${params}`);

    if (!response.ok) return null;

    const data = await response.json();

    return data as PagedResponse<Song>;
}

export async function getTopSongs(time: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/songs/top-songs?time=${time}`);

    if (!response.ok) return null;

    const data = await response.json();

    return data as TopSong[];
}

export async function searchSongs(value: string, query: PagingQuery) {
    const params = new URLSearchParams({
        q: value,
        ...query as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/songs/search?${params}`);

    if (!response.ok) return null;

    const data = await response.json();

    return data as PagedResponse<Song>;
}

export async function getSongById(songId: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/songs/${songId}`);

    if (!response.ok) return null;

    const data = await response.json();

    return data as SongDetail;
}

export async function createSong(request: CreateUpdateSongRequest, accessToken: string) {
    const formData = new FormData();

    formData.append("name", request.name);
    formData.append("language", request.language.toString());
    if (request.length) formData.append("length", request.length.toString());
    if (request.releasedAt) formData.append("releasedAt", request.releasedAt);
    if (request.songUrl) formData.append("songUrl", request.songUrl);
    if (request.image) formData.append("image", request.image);
    
    request.artistIds?.forEach(a => {
        formData.append("artistIds", a);
    });

    request.genreIds?.forEach(g => {
        formData.append("genreIds", g);
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/songs`, {
        method: "POST",
        accessToken,
        body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return data as CudSongResponse;
}

export async function updateSong(
    songId: string, 
    request: CreateUpdateSongRequest, 
    accessToken: string
) {
    const formData = new FormData();

    formData.append("name", request.name);
    formData.append("language", request.language.toString());
    if (request.releasedAt) formData.append("releasedAt", request.releasedAt);
    if (request.songUrl) formData.append("songUrl", request.songUrl);
    if (request.image) formData.append("image", request.image);
    
    request.artistIds?.forEach(a => {
        formData.append("artistIds", a);
    });

    request.genreIds?.forEach(g => {
        formData.append("genreIds", g);
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/songs/${songId}`, {
        method: "PUT",
        accessToken,
        body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return data as CudSongResponse;
}

export async function deleteSong(songId: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/songs/${songId}`, {
        method: "DELETE",
        accessToken
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return data as CudSongResponse;
}