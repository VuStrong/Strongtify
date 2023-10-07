import { Prisma } from "@prisma/client";
import { CreatePlaylistDto } from "../dtos/cud/create-playlist.dto";
import { UpdatePlaylistDto } from "../dtos/cud/update-playlist.dto";
import { CudPlaylistResponseDto } from "../dtos/cud/cud-playlist-response.dto";

/**
 * Interface for Playlist to perform CUD operations (Create, Update, Delete)
 */
export interface CudPlaylistService {
    create(
        createPlaylistDto: CreatePlaylistDto,
    ): Promise<CudPlaylistResponseDto>;

    update(params: {
        where: Prisma.PlaylistWhereUniqueInput;
        data: UpdatePlaylistDto;
    }): Promise<CudPlaylistResponseDto>;

    delete(id: string): Promise<CudPlaylistResponseDto>;
}
