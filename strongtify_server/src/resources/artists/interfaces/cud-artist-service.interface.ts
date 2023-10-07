import { Prisma } from "@prisma/client";
import { CreateArtistDto } from "../dtos/cud/create-artist.dto";
import { UpdateArtistDto } from "../dtos/cud/update-artist.dto";
import { CudArtistResponseDto } from "../dtos/cud/cud-artist-response.dto";

/**
 * Interface for Artist to perform CUD operations (Create, Update, Delete)
 */
export interface CudArtistService {
    create(createArtistDto: CreateArtistDto): Promise<CudArtistResponseDto>;

    update(params: {
        where: Prisma.ArtistWhereUniqueInput;
        data: UpdateArtistDto;
    }): Promise<CudArtistResponseDto>;

    delete(id: string): Promise<CudArtistResponseDto>;
}
