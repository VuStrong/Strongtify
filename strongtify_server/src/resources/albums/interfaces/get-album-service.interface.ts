import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { AlbumDetailResponseDto } from "../dtos/get/album-detail-response.dto";
import { AlbumParamDto } from "../dtos/query-params/album-param.dto";
import { AlbumResponseDto } from "../dtos/get/album-response.dto";

/**
 * Interface for Album to perform Read operations
 */
export interface GetAlbumService {
    /**
     * Get album by ID contains all songs in it
     * @param id - Album's ID
     */
    findByIdWithSongs(id: string): Promise<AlbumDetailResponseDto>;

    /**
     * Get albums
     * @param params - options to filter albums
     */
    get(params: AlbumParamDto): Promise<PagedResponseDto<AlbumResponseDto>>;

    /**
     * Get an array contain random albums
     * @param count - length of array
     */
    getRandomAlbums(count: number): Promise<AlbumResponseDto[]>;
}
