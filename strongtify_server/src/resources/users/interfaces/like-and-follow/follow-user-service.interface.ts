import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { UserResponseDto } from "../../dtos/get/user-response.dto";
import { QueryParamDto } from "src/common/dtos/query-param.dto";

/**
 * Interface for User to deal with followings and followers
 */
export interface FollowUserService {
    /**
     * Get following users of an user
     * @param userId - User's ID
     * @param params - options for filter
     */
    getFollowingUsers(
        userId: string,
        params: QueryParamDto,
    ): Promise<PagedResponseDto<UserResponseDto>>;

    /**
     * Get followers of an user
     * @param userId - User's ID
     * @param params - options for filter
     */
    getFollowers(
        userId: string,
        params: QueryParamDto,
    ): Promise<PagedResponseDto<UserResponseDto>>;

    /**
     * add an user to another user's followings.
     * @param userId - User's ID
     * @param idToFollow - User's ID to follow
     **/
    followUser(userId: string, idToFollow: string): Promise<boolean>;

    /**
     * remove an user from another user's followings.
     * @param userId - User's ID
     * @param idToUnFollow - User's ID to unfollow
     **/
    unFollowUser(userId: string, idToUnFollow: string): Promise<boolean>;

    /**
     * Check if an user is following another user.
     * @param userId - User's ID
     * @param idToCheck - User's ID to check if following or not
     **/
    checkFollowingUser(userId: string, idToCheck: string): Promise<boolean>;

    getAllFollowingUserIds(userId: string): Promise<string[]>;
}
