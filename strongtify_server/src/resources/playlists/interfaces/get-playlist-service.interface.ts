import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { PlaylistDetailResponseDto } from "../dtos/get/playlist-detail-response.dto";
import { PlaylistParamDto } from "../dtos/query-params/playlist-param.dto";
import { PagingParamDto } from "src/common/dtos/paging-param.dto";
import { PlaylistResponseDto } from "../dtos/get/playlist-response.dto";

/**
 * Interface for Playlist to perform Read operations
 */
export interface GetPlaylistService {
    /**
     * Find playlist by ID contains all songs in it
     * @param id - Playlist's ID
     */
    findByIdWithSongs(id: string): Promise<PlaylistDetailResponseDto>;

    /**
     * Get playlists
     * @param params - options to filter playlists
     */
    get(
        params: PlaylistParamDto,
    ): Promise<PagedResponseDto<PlaylistResponseDto>>;

    /**
     * Search for playlists
     * @param value - keyword to search playlists
     * @param pagingParams - options for pagination
     */
    search(
        value: string,
        pagingParams: PagingParamDto,
    ): Promise<PagedResponseDto<PlaylistResponseDto>>;
}
