import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { PagingParamDto } from "src/common/dtos/paging-param.dto";
import { PlaylistResponseDto } from "src/resources/playlists/dtos/get/playlist-response.dto";

/**
 * Interface for User to deal with liked playlists
 */
export interface LikePlaylistService {
    /**
     * Get user's liked playlists
     * @param userId - User's ID
     * @param pagingParams - options for pagination
     */
    getLikedPlaylists(
        userId: string,
        pagingParams: PagingParamDto,
    ): Promise<PagedResponseDto<PlaylistResponseDto>>;

    /**
     * Add a playlist to user's liked playlists
     * @param userId - User's ID
     * @param playlistId - Playlists's ID to add
     **/
    likePlaylist(userId: string, playlistId: string): Promise<boolean>;

    /**
     * Remove a playlist from user's liked playlists.
     * @param userId - User's ID
     * @param playlistId - Playlists's ID to remove
     **/
    unlikePlaylist(userId: string, playlistId: string): Promise<boolean>;

    /**
     * Check if an user is liked a playlist or not
     */
    checkLikedPlaylist(userId: string, playlistId: string): Promise<boolean>;
}
