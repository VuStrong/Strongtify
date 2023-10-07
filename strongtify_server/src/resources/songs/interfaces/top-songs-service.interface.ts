import { TopSongResponseDto } from "../dtos/get/top-song-response.dto";
import { TopSongsParamDto } from "../dtos/query-params/top-songs-param.dto";

/**
 * Interface to get top songs
 */
export interface TopSongsService {
    getTopSongs(params: TopSongsParamDto): Promise<TopSongResponseDto[]>;
}
