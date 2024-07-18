import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { QueryParamDto } from "src/common/dtos/query-param.dto";
import { SongResponseDto } from "src/resources/songs/dtos/get/song-response.dto";

/**
 * Interface for User to manage listen history
 */
export interface UserListenService {
    addToListen(userId: string, songId: string): Promise<boolean>;

    removeFromListen(userId: string, songId: string): Promise<boolean>;

    getListenHistory(
        userId: string,
        params: QueryParamDto,
    ): Promise<PagedResponseDto<SongResponseDto>>;
}