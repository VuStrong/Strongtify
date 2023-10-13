import { Prisma } from "@prisma/client";
import { GenreDetailResponseDto } from "../dtos/get/genre-detail-response.dto";
import { GenreDetailParamDto } from "../dtos/query-params/genre-detail-param.dto";
import { GenreResponseDto } from "../dtos/get/genre-response.dto";
import { QueryParamDto } from "src/common/dtos/query-param.dto";
import { PagedResponseDto } from "src/common/dtos/paged-response.dto";

/**
 * Interface for Genre to perform Read operations
 */
export interface GetGenreService {
    /**
     * Get genres
     * @param params - options to filter genres
     */
    get(params: QueryParamDto): Promise<PagedResponseDto<GenreResponseDto>>;

    /**
     * Find genre by ID contains songs and albums
     * @param id - Genre's ID
     * @param detailParams - options to contains songs and albums
     */
    findByIdWithDetails(
        id: string,
        detailParams?: GenreDetailParamDto,
    ): Promise<GenreDetailResponseDto>;

    /**
     * Get an array contain random genres
     * @param count - length of array
     * @param include - options to include relationship
     */
    getRandomGenres(
        count: number,
        include?: Prisma.GenreInclude,
    ): Promise<GenreDetailResponseDto[]>;
}
