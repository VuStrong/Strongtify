import { BACKEND_API_URL } from "@/libs/constants";
import { Artist, ArtistDetail, ArtistDetailQuery, CreateUpdateArtistRequest, CudArtistResponse } from "@/types/artist";
import { PagedResponse, PagingQuery } from "@/types/paging";
import callAPI from "../callApi";

export async function getArtists(query: PagingQuery) {
    const params = new URLSearchParams({
        ...query as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/artists?${params}`);

    if (!response.ok) return null;

    const data = await response.json();

    return data as PagedResponse<Artist>;
}

export async function getArtistById(artistId: string, query?: ArtistDetailQuery) {
    const params = query && new URLSearchParams({
        ...query as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/artists/${artistId}?${params ?? ""}`);

    if (!response.ok) return null;

    const data = await response.json();

    return data as ArtistDetail;
}

export async function createArtist(request: CreateUpdateArtistRequest, accessToken: string) {
    const formData = new FormData();

    formData.append("name", request.name);
    if (request.birthDate) formData.append("birthDate", request.birthDate);
    if (request.about) formData.append("about", request.about);
    if (request.image) formData.append("image", request.image);

    const response = await callAPI(`${BACKEND_API_URL}/v1/artists`, {
        method: "POST",
        accessToken,
        body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return data as CudArtistResponse;
}

export async function updateArtist(
    artistId: string, 
    request: CreateUpdateArtistRequest, 
    accessToken: string
) {
    const formData = new FormData();

    formData.append("name", request.name);
    if (request.birthDate) formData.append("birthDate", request.birthDate);
    if (request.about) formData.append("about", request.about);
    if (request.image) formData.append("image", request.image);

    const response = await callAPI(`${BACKEND_API_URL}/v1/artists/${artistId}`, {
        method: "PUT",
        accessToken,
        body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return data as CudArtistResponse;
}

export async function deleteArtist(artistId: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/artists/${artistId}`, {
        method: "DELETE",
        accessToken
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return data as CudArtistResponse;
}