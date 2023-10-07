import { Prisma } from "@prisma/client";
import { GenreDetailResponseDto } from "../dtos/get/genre-detail-response.dto";
import { GenreDetailParamDto } from "../dtos/query-params/genre-detail-param.dto";
import { GenreResponseDto } from "../dtos/get/genre-response.dto";

/**
 * Interface for Genre to perform Read operations
 */
export interface GetGenreService {
    getAll(): Promise<GenreResponseDto[]>;

    /**
     * Search for genres
     * @param value - keyword to search
     */
    search(value: string): Promise<GenreResponseDto[]>;

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
