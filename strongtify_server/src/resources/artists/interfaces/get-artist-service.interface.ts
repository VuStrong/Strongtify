import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { ArtistResponseDto } from "../dtos/get/artist-response.dto";
import { ArtistDetailParamDto } from "../dtos/query-params/artist-detail-param.dto";
import { QueryParamDto } from "src/common/dtos/query-param.dto";
import { ArtistDetailResponseDto } from "../dtos/get/artist-detail-response.dto";

/**
 * Interface for Artist to perform Read operations
 */
export interface GetArtistService {
    /**
     * get artists
     * @param params - options to filter artists
     */
    get(params: QueryParamDto): Promise<PagedResponseDto<ArtistResponseDto>>;

    /**
     * Find artist by ID contains songs and albums
     * @param id - Artist's ID
     * @param detailParams - options to contains songs and albums
     */
    findByIdWithDetails(
        id: string,
        detailParams?: ArtistDetailParamDto,
    ): Promise<ArtistDetailResponseDto>;
}
