import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { QueryParamDto } from "src/common/dtos/query-param.dto";
import { ArtistResponseDto } from "src/resources/artists/dtos/get/artist-response.dto";

/**
 * Interface for User to deal with following artists
 */
export interface FollowArtistService {
    /**
     * Get user's following artists
     * @param userId - User's ID
     * @param params - options for filter
     */
    getFollowingArtists(
        userId: string,
        params: QueryParamDto,
    ): Promise<PagedResponseDto<ArtistResponseDto>>;

    /**
     * add an artist to user's following artists.
     * @param userId - User's ID
     * @param artistId - Artist's ID to add
     **/
    followArtist(userId: string, artistId: string): Promise<boolean>;

    /**
     * remove an artist from user's following artists.
     * @param userId - User's ID
     * @param artistId - Artist's ID to remove
     **/
    unFollowArtist(userId: string, artistId: string): Promise<boolean>;

    /**
     * Check if an user is following an artist or not
     */
    checkFollowingArtist(userId: string, artistId: string): Promise<boolean>;
}
