import { Prisma } from "@prisma/client";

import { CreateAlbumDto } from "../dtos/cud/create-album.dto";
import { UpdateAlbumDto } from "../dtos/cud/update-album.dto";
import { CudAlbumResponseDto } from "../dtos/cud/cud-album-response.dto";

/**
 * Interface for Album to perform CUD operations (Create, Update, Delete)
 */
export interface CudAlbumService {
    create(createAlbumDto: CreateAlbumDto): Promise<CudAlbumResponseDto>;

    update(params: {
        where: Prisma.AlbumWhereUniqueInput;
        data: UpdateAlbumDto;
    }): Promise<CudAlbumResponseDto>;

    delete(id: string): Promise<CudAlbumResponseDto>;
}
