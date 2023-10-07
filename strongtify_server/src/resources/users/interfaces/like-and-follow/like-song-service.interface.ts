import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { PagingParamDto } from "src/common/dtos/paging-param.dto";
import { SongResponseDto } from "src/resources/songs/dtos/get/song-response.dto";

/**
 * Interface for User to deal with liked songs
 */
export interface LikeSongService {
    /**
     * Get user's liked songs
     * @param userId - User's ID
     * @param pagingParams - options for pagination
     */
    getLikedSongs(
        userId: string,
        pagingParams: PagingParamDto,
    ): Promise<PagedResponseDto<SongResponseDto>>;

    /**
     * Add a song to user's liked songs
     * @param userId - User's ID
     * @param songId - Songs's ID to add
     **/
    likeSong(userId: string, songId: string): Promise<boolean>;

    /**
     * Remove a song from user's liked songs.
     * @param userId - User's ID
     * @param songId - Songs's ID to remove
     **/
    unlikeSong(userId: string, songId: string): Promise<boolean>;

    /**
     * Check if an user is liked a song or not
     */
    checkLikedSong(userId: string, songId: string): Promise<boolean>;
}
