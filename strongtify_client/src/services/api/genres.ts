import { CreateUpdateGenreRequest, CudGenreResponse, Genre, GenreDetail, GenreDetailQuery } from "@/types/genre";
import callAPI from "../callApi";
import { BACKEND_API_URL } from "@/libs/constants";

export async function getGenres(value: string = "") {
    const response = await callAPI(`${BACKEND_API_URL}/v1/genres?q=${value}`);

    if (!response.ok) return null;

    const data = await response.json();

    return data as Genre[];
}

export async function getGenreById(genreId: string, query?: GenreDetailQuery) {
    const params = query && new URLSearchParams({
        ...query as any
    });

    const response = await callAPI(`${BACKEND_API_URL}/v1/genres/${genreId}?${params ?? ""}`);

    if (!response.ok) return null;

    const data = await response.json();

    return data as GenreDetail;
}

export async function createGenre(request: CreateUpdateGenreRequest, accessToken: string) {
    const formData = new FormData();

    formData.append("name", request.name);
    if (request.description) formData.append("description", request.description);
    if (request.image) formData.append("image", request.image);

    const response = await callAPI(`${BACKEND_API_URL}/v1/genres`, {
        method: "POST",
        accessToken,
        body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return data as CudGenreResponse;
}

export async function updateGenre(genreId: string, request: CreateUpdateGenreRequest, accessToken: string) {
    const formData = new FormData();

    formData.append("name", request.name);
    if (request.description) formData.append("description", request.description);
    if (request.image) formData.append("image", request.image);

    const response = await callAPI(`${BACKEND_API_URL}/v1/genres/${genreId}`, {
        method: "PUT",
        accessToken,
        body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return data as CudGenreResponse;
}

export async function deleteGenre(genreId: string, accessToken: string) {
    const response = await callAPI(`${BACKEND_API_URL}/v1/genres/${genreId}`, {
        method: "DELETE",
        accessToken,
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message ?? "Đã xảy ra lỗi");
    }

    return data as CudGenreResponse;
}