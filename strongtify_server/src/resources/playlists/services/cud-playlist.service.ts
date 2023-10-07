import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { CudPlaylistService } from "../interfaces/cud-playlist-service.interface";
import {
    UPLOAD_SERVICE,
    UploadService,
} from "src/upload/interfaces/upload.interface";
import { PrismaService } from "src/database/prisma.service";
import { StringService } from "src/common/utils/string.service";
import { CreatePlaylistDto } from "../dtos/cud/create-playlist.dto";
import { UploadFolder } from "src/upload/enums/folder.enum";
import { PrismaError } from "src/database/enums/prisma-error.enum";
import { Prisma } from "@prisma/client";
import { PlaylistNotFoundException } from "../exceptions/playlist-not-found.exception";
import { UpdatePlaylistDto } from "../dtos/cud/update-playlist.dto";
import { CudPlaylistResponseDto } from "../dtos/cud/cud-playlist-response.dto";

@Injectable()
export class CudPlaylistServiceImpl implements CudPlaylistService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(UPLOAD_SERVICE) private readonly uploadService: UploadService,
        private readonly stringService: StringService,
    ) {}

    async create(
        createPlaylistDto: CreatePlaylistDto,
    ): Promise<CudPlaylistResponseDto> {
        const { name, description, status, userId, image } = createPlaylistDto;

        // upload image
        const uploadResponse =
            image &&
            (await this.uploadService
                .uploadFile(image, {
                    folder: UploadFolder.PLAYLIST_IMAGE,
                })
                .catch(() => undefined));

        return this.prisma.playlist
            .create({
                data: {
                    name,
                    description,
                    status,
                    alias: this.stringService.slug(name),
                    imageId: uploadResponse?.fileId,
                    imageUrl: uploadResponse?.url,
                    user: {
                        connect: { id: userId },
                    },
                },
            })
            .catch((error) => {
                // if playlist can not create, delete the image created
                if (uploadResponse)
                    this.uploadService.deleteFile(uploadResponse.fileId);

                if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                    throw new NotFoundException("User was not found.");
                }

                throw new InternalServerErrorException();
            });
    }

    async update(params: {
        where: Prisma.PlaylistWhereUniqueInput;
        data: UpdatePlaylistDto;
    }): Promise<CudPlaylistResponseDto> {
        const { where, data } = params;
        const { name, description, status, image } = data;

        // if not upload image, then no need to query old playlist to compare later
        const oldPlaylist =
            image &&
            (await this.prisma.playlist
                .findUniqueOrThrow({
                    where,
                    select: { imageId: true },
                })
                .catch(() => {
                    throw new PlaylistNotFoundException();
                }));

        // upload image
        const uploadResponse =
            image &&
            (await this.uploadService
                .uploadFile(image, {
                    folder: UploadFolder.PLAYLIST_IMAGE,
                })
                .catch(() => undefined));

        const updatedPlaylist = await this.prisma.playlist
            .update({
                where,
                data: {
                    name,
                    description,
                    status,
                    alias: this.stringService.slug(name),
                    imageId: uploadResponse?.fileId,
                    imageUrl: uploadResponse?.url,
                },
            })
            .catch((error) => {
                // if playlist can not update, delete the image created
                if (uploadResponse)
                    this.uploadService.deleteFile(uploadResponse.fileId);

                if (
                    error?.code === PrismaError.QUERY_INTERPRETATION_ERROR ||
                    error?.code === PrismaError.ENTITY_NOT_FOUND
                ) {
                    throw new PlaylistNotFoundException();
                } else {
                    throw new InternalServerErrorException();
                }
            });

        // if playlist updated, delete the old image if it exist
        if (
            oldPlaylist?.imageId &&
            updatedPlaylist.imageId !== oldPlaylist.imageId
        )
            this.uploadService.deleteFile(oldPlaylist.imageId);

        return updatedPlaylist;
    }

    async delete(id: string): Promise<CudPlaylistResponseDto> {
        const playlist = await this.prisma.playlist
            .delete({ where: { id } })
            .catch((error) => {
                if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                    throw new PlaylistNotFoundException();
                } else {
                    throw new InternalServerErrorException();
                }
            });

        // if playlist have an image, delete it
        if (playlist.imageId) this.uploadService.deleteFile(playlist.imageId);

        return playlist;
    }
}
