import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { CudAlbumService } from "../interfaces/cud-album-service.interface";
import {
    UPLOAD_SERVICE,
    UploadService,
} from "src/upload/interfaces/upload.interface";
import { StringService } from "src/common/utils/string.service";
import { PrismaService } from "src/database/prisma.service";
import { UploadFolder } from "src/upload/enums/folder.enum";
import { PrismaError } from "src/database/enums/prisma-error.enum";
import { AlbumNotFoundException } from "../exceptions/album-not-found.exception";

import { CreateAlbumDto } from "../dtos/cud/create-album.dto";
import { UpdateAlbumDto } from "../dtos/cud/update-album.dto";
import { CudAlbumResponseDto } from "../dtos/cud/cud-album-response.dto";

@Injectable()
export class CudAlbumServiceImpl implements CudAlbumService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(UPLOAD_SERVICE) private readonly uploadService: UploadService,
        private readonly stringService: StringService,
    ) {}

    async create(createAlbumDto: CreateAlbumDto): Promise<CudAlbumResponseDto> {
        const { artistId, genreIds, name, image } = createAlbumDto;
        const connectArtistQuery = artistId
            ? {
                  connect: { id: artistId },
              }
            : undefined;

        // upload image
        const uploadResponse =
            image &&
            (await this.uploadService
                .uploadFile(image, {
                    folder: UploadFolder.ALBUM_IMAGE,
                })
                .catch(() => undefined));

        return this.prisma.album
            .create({
                data: {
                    name,
                    alias: this.stringService.slug(name),
                    artist: connectArtistQuery,
                    imageId: uploadResponse?.fileId,
                    imageUrl: uploadResponse?.url,
                    genres: {
                        connect: this.prisma.toPrismaConnectObject(genreIds),
                    },
                },
            })
            .catch((error) => {
                // if album can not create, delete the image created
                if (uploadResponse)
                    this.uploadService.deleteFile(uploadResponse.fileId);

                if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                    throw new NotFoundException("Some entity was not found.");
                }

                throw new InternalServerErrorException();
            });
    }

    async update(params: {
        where: Prisma.AlbumWhereUniqueInput;
        data: UpdateAlbumDto;
    }): Promise<CudAlbumResponseDto> {
        const { where, data } = params;
        const { artistId, genreIds, name, image } = data;

        const setGenresQuery = genreIds === undefined ? undefined : [];

        let connectArtistQuery = undefined;
        if (artistId === undefined || artistId === null) {
            connectArtistQuery = { artistId };
        } else {
            connectArtistQuery = {
                artist: {
                    connect: { id: artistId },
                },
            };
        }

        // if not upload image, then no need to query old album to compare later
        const oldAlbum =
            image &&
            (await this.prisma.album
                .findUniqueOrThrow({
                    where,
                    select: { imageId: true },
                })
                .catch(() => {
                    throw new AlbumNotFoundException();
                }));

        // upload image
        const uploadResponse =
            image &&
            (await this.uploadService
                .uploadFile(image, {
                    folder: UploadFolder.ALBUM_IMAGE,
                })
                .catch(() => undefined));

        const updatedAlbum = await this.prisma.album
            .update({
                where,
                data: {
                    name,
                    alias: this.stringService.slug(name),
                    imageId: uploadResponse?.fileId,
                    imageUrl: uploadResponse?.url,
                    ...connectArtistQuery,
                    genres: {
                        set: setGenresQuery,
                        connect: this.prisma.toPrismaConnectObject(genreIds),
                    },
                },
            })
            .catch((error) => {
                // if album can not update, delete the image created
                if (uploadResponse)
                    this.uploadService.deleteFile(uploadResponse.fileId);

                if (error?.code === PrismaError.QUERY_INTERPRETATION_ERROR) {
                    throw new AlbumNotFoundException();
                } else if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                    throw new NotFoundException(
                        "Album or some entity was not found.",
                    );
                } else {
                    throw new InternalServerErrorException();
                }
            });

        // if album updated, delete the old image if it exist
        if (oldAlbum?.imageId && updatedAlbum.imageId !== oldAlbum.imageId)
            this.uploadService.deleteFile(oldAlbum.imageId);

        return updatedAlbum;
    }

    async delete(id: string): Promise<CudAlbumResponseDto> {
        const album = await this.prisma.album
            .delete({ where: { id } })
            .catch((error) => {
                if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                    throw new AlbumNotFoundException();
                } else {
                    throw new InternalServerErrorException();
                }
            });

        // if album have an image, delete it
        if (album.imageId) this.uploadService.deleteFile(album.imageId);

        return album;
    }
}
