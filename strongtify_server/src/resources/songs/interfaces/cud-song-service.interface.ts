import { Prisma } from "@prisma/client";
import { CreateSongDto } from "../dtos/cud/create-song.dto";
import { CudSongResponseDto } from "../dtos/cud/cud-song-response.dto";
import { UpdateSongDto } from "../dtos/cud/update-song.dto";

/**
 * Interface for Song to perform CUD operations (Create, Update, Delete)
 */
export interface CudSongService {
    create(createSongDto: CreateSongDto): Promise<CudSongResponseDto>;

    update(params: {
        where: Prisma.SongWhereUniqueInput;
        data: UpdateSongDto;
    }): Promise<CudSongResponseDto>;

    delete(id: string): Promise<CudSongResponseDto>;
}
