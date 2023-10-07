import { UpdateAccountRequest, Account } from "@/types/user";
import { BACKEND_API_URL } from "@/libs/constants";
import callAPI from "../callApi";
import { PagedResponse, PagingQuery } from "@/types/paging";
import { Song } from "@/types/song";
import { Album } from "@/types/album";
import { Playlist } from "@/types/playlist";

export async function getAccount(accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/me`, {
        accessToken
    });

    if (!response.ok) {
        return null;
    }
    
    const data = await response.json();

    return data as Account;
}

export async function updateAccount(request: UpdateAccountRequest, accessToken: string) {
    const formData = new FormData();

    if (request.name) formData.append("name", request.name);
    if (request.gender) formData.append("gender", request.gender);
    if (request.about) formData.append("about", request.about);
    if (request.image) formData.append("image", request.image);
    if (request.birthDate) formData.append("birthDate", request.birthDate);

    const response = await callAPI(`${BACKEND_API_URL}/v1/me`, {
        method: "PATCH",
        accessToken,
        body: formData
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return data as Account;
}

export async function changePassword(
    oldPassword: string,
    newPassword: string,
    accessToken: string
) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/me/password`, {
        method: "PATCH",
        contentType: "application/json",
        accessToken,
        body: JSON.stringify({ oldPassword, newPassword })
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Đã xảy ra lỗi.");
    }

    return true;
}

export async function followUser(idToFollow: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/me/following-users`, {
        method: "POST",
        accessToken,
        contentType: "application/json",
        body: JSON.stringify({ idToFollow })
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Đã xảy ra lỗi.");
    }

    return true;
}

export async function unFollowUser(idToUnFollow: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/me/following-users/${idToUnFollow}`, {
        method: "DELETE",
        accessToken,
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Đã xảy ra lỗi.");
    }

    return true;
}

export async function followArtist(artistId: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/me/following-artists`, {
        method: "POST",
        accessToken,
        contentType: "application/json",
        body: JSON.stringify({ artistId })
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Đã xảy ra lỗi.");
    }

    return true;
}

export async function unFollowArtist(artistId: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/me/following-artists/${artistId}`, {
        method: "DELETE",
        accessToken,
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Đã xảy ra lỗi.");
    }

    return true;
}

export async function getLikedSongs(accessToken: string, pagingQuery: PagingQuery) {
    const params = new URLSearchParams({
        ...pagingQuery as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/me/liked-songs?${params}`, {
        accessToken
    });

    if (!response.ok) return null;

    const data = await response.json();

    return data as PagedResponse<Song>;
}

export async function getLikedAlbums(accessToken: string, pagingQuery: PagingQuery) {
    const params = new URLSearchParams({
        ...pagingQuery as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/me/liked-albums?${params}`, {
        accessToken
    });

    if (!response.ok) return null;

    const data = await response.json();

    return data as PagedResponse<Album>;
}

export async function getLikedPlaylists(accessToken: string, pagingQuery: PagingQuery) {
    const params = new URLSearchParams({
        ...pagingQuery as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/me/liked-playlists?${params}`, {
        accessToken
    });

    if (!response.ok) return null;

    const data = await response.json();

    return data as PagedResponse<Playlist>;
}

export async function likeSong(songId: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/me/liked-songs`, {
        method: "POST",
        accessToken,
        contentType: "application/json",
        body: JSON.stringify({ songId })
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Đã xảy ra lỗi.");
    }

    return true;
}

export async function unLikeSong(songId: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/me/liked-songs/${songId}`, {
        method: "DELETE",
        accessToken,
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Đã xảy ra lỗi.");
    }

    return true;
}

export async function likeAlbum(albumId: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/me/liked-albums`, {
        method: "POST",
        accessToken,
        contentType: "application/json",
        body: JSON.stringify({ albumId })
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Đã xảy ra lỗi.");
    }

    return true;
}

export async function unLikeAlbum(albumId: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/me/liked-albums/${albumId}`, {
        method: "DELETE",
        accessToken,
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Đã xảy ra lỗi.");
    }

    return true;
}

export async function likePlaylist(playlistId: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/me/liked-playlists`, {
        method: "POST",
        accessToken,
        contentType: "application/json",
        body: JSON.stringify({ playlistId })
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Đã xảy ra lỗi.");
    }

    return true;
}

export async function unLikePlaylist(playlistId: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/me/liked-playlists/${playlistId}`, {
        method: "DELETE",
        accessToken,
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Đã xảy ra lỗi.");
    }

    return true;
}

export async function checkLikedSong(songId: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/me/liked-songs/${songId}`, {
        method: "HEAD",
        accessToken
    });

    return response.ok;
}

export async function checkLikedAlbum(albumId: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/me/liked-albums/${albumId}`, {
        method: "HEAD",
        accessToken
    });

    return response.ok;
}

export async function checkLikedPlaylist(playlistId: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/me/liked-playlists/${playlistId}`, {
        method: "HEAD",
        accessToken
    });

    return response.ok;
}