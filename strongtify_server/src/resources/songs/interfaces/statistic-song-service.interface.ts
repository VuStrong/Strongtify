import { TopSongResponseDto } from "../dtos/get/top-song-response.dto";
import { TopSongsParamDto } from "../dtos/query-params/top-songs-param.dto";

export interface StatisticSongService {
    getTopSongs(params: TopSongsParamDto): Promise<TopSongResponseDto[]>;
}
