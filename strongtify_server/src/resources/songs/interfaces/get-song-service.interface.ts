import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { SongParamDto } from "../dtos/query-params/song-param.dto";
import { SongResponseDto } from "../dtos/get/song-response.dto";
import { SongDetailResponseDto } from "../dtos/get/song-detail-response.dto";

/**
 * Interface for Song to perform Read operations
 */
export interface GetSongService {
    /**
     * Find song by ID contain genres and artists
     * @param id - Song's ID
     */
    findByIdWithDetails(id: string): Promise<SongDetailResponseDto>;

    /**
     * Get songs
     * @param params - options to filter songs
     */
    get(params: SongParamDto): Promise<PagedResponseDto<SongResponseDto>>;

    /**
     * Get an array contain random songs
     * @param count - length of array
     */
    getRandomSongs(count: number): Promise<SongResponseDto[]>;
}
