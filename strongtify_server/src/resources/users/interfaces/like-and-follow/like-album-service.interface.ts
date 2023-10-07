import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { PagingParamDto } from "src/common/dtos/paging-param.dto";
import { AlbumResponseDto } from "src/resources/albums/dtos/get/album-response.dto";

/**
 * Interface for User to deal with liked albums
 */
export interface LikeAlbumService {
    /**
     * Get user's liked albums
     * @param userId - User's ID
     * @param pagingParams - options for pagination
     */
    getLikedAlbums(
        userId: string,
        pagingParams: PagingParamDto,
    ): Promise<PagedResponseDto<AlbumResponseDto>>;

    /**
     * Add an album to user's liked albums
     * @param userId - User's ID
     * @param albumId - Albums's ID to add
     **/
    likeAlbum(userId: string, albumId: string): Promise<boolean>;

    /**
     * Remove an album from user's liked albums.
     * @param userId - User's ID
     * @param albumId - Albums's ID to remove
     **/
    unlikeAlbum(userId: string, albumId: string): Promise<boolean>;

    /**
     * Check if an user is liked album or not
     */
    checkLikedAlbum(userId: string, albumId: string): Promise<boolean>;
}
