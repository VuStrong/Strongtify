import { AlbumResponseDto } from "src/resources/albums/dtos/get/album-response.dto";

export interface RecommendService {
    getUserRecommendedAlbums(
        userId: string,
        count: number,
    ): Promise<AlbumResponseDto[]>;
}
