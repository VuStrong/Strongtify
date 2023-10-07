import { Prisma } from "@prisma/client";
import { CreateGenreDto } from "../dtos/cud/create-genre.dto";
import { UpdateGenreDto } from "../dtos/cud/update-genre.dto";
import { CudGenreResponseDto } from "../dtos/cud/cud-genre-response.dto";

/**
 * Interface for Genre to perform CUD operations (Create, Update, Delete)
 */
export interface CudGenreService {
    create(createGenreDto: CreateGenreDto): Promise<CudGenreResponseDto>;

    update(params: {
        where: Prisma.GenreWhereUniqueInput;
        data: UpdateGenreDto;
    }): Promise<CudGenreResponseDto>;

    delete(id: string): Promise<CudGenreResponseDto>;
}
