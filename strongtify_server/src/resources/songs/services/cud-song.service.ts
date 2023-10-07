import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { CudSongService } from "../interfaces/cud-song-service.interface";
import { PrismaService } from "src/database/prisma.service";
import {
    UPLOAD_SERVICE,
    UploadService,
} from "src/upload/interfaces/upload.interface";
import { StringService } from "src/common/utils/string.service";
import { CreateSongDto } from "../dtos/cud/create-song.dto";
import { UploadFolder } from "src/upload/enums/folder.enum";
import { PrismaError } from "src/database/enums/prisma-error.enum";
import { Prisma } from "@prisma/client";
import { UpdateSongDto } from "../dtos/cud/update-song.dto";
import { CudSongResponseDto } from "../dtos/cud/cud-song-response.dto";
import { SongNotFoundException } from "../exceptions/song-not-found.exception";

@Injectable()
export class CudSongServiceImpl implements CudSongService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(UPLOAD_SERVICE) private readonly uploadService: UploadService,
        private readonly stringService: StringService,
    ) {}

    async create(createSongDto: CreateSongDto): Promise<CudSongResponseDto> {
        const { artistIds, genreIds, image } = createSongDto;
        delete createSongDto.artistIds;
        delete createSongDto.genreIds;
        delete createSongDto.image;

        // upload image
        const uploadResponse =
            image &&
            (await this.uploadService
                .uploadFile(image, {
                    folder: UploadFolder.SONG_IMAGE,
                })
                .catch(() => undefined));

        return this.prisma.song
            .create({
                data: {
                    ...createSongDto,
                    alias: this.stringService.slug(createSongDto.name),
                    imageId: uploadResponse?.fileId,
                    imageUrl: uploadResponse?.url,
                    artists: {
                        connect: this.prisma.toPrismaConnectObject(artistIds),
                    },
                    genres: {
                        connect: this.prisma.toPrismaConnectObject(genreIds),
                    },
                },
            })
            .catch((error) => {
                // if song can not create, delete the image created
                if (uploadResponse)
                    this.uploadService.deleteFile(uploadResponse.fileId);

                if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                    throw new NotFoundException("Some entity was not found.");
                }

                throw new InternalServerErrorException();
            });
    }

    async update(params: {
        where: Prisma.SongWhereUniqueInput;
        data: UpdateSongDto;
    }): Promise<CudSongResponseDto> {
        const { where, data } = params;
        const { artistIds, genreIds, image } = data;
        delete data.artistIds;
        delete data.genreIds;
        delete data.image;

        const setArtistsQuery = artistIds === undefined ? undefined : [];
        const setGenresQuery = genreIds === undefined ? undefined : [];

        // if not upload image, then no need to query old song to compare later
        const oldSong =
            image &&
            (await this.prisma.song
                .findUniqueOrThrow({
                    where,
                    select: { imageId: true },
                })
                .catch(() => {
                    throw new SongNotFoundException();
                }));

        // upload image
        const uploadResponse =
            image &&
            (await this.uploadService
                .uploadFile(image, {
                    folder: UploadFolder.SONG_IMAGE,
                })
                .catch(() => undefined));

        const updatedSong = await this.prisma.song
            .update({
                where,
                data: {
                    ...data,
                    alias: this.stringService.slug(data.name),
                    imageId: uploadResponse?.fileId,
                    imageUrl: uploadResponse?.url,
                    artists: {
                        set: setArtistsQuery,
                        connect: this.prisma.toPrismaConnectObject(artistIds),
                    },
                    genres: {
                        set: setGenresQuery,
                        connect: this.prisma.toPrismaConnectObject(genreIds),
                    },
                },
            })
            .catch((error) => {
                // if song can not update, delete the image created
                if (uploadResponse)
                    this.uploadService.deleteFile(uploadResponse.fileId);

                if (error?.code === PrismaError.QUERY_INTERPRETATION_ERROR) {
                    throw new SongNotFoundException();
                } else if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                    throw new NotFoundException(
                        "Song or some entity was not found.",
                    );
                } else {
                    throw new InternalServerErrorException();
                }
            });

        // if song updated, delete the old image if it exist
        if (oldSong?.imageId && updatedSong.imageId !== oldSong.imageId)
            this.uploadService.deleteFile(oldSong.imageId);

        return updatedSong;
    }

    async delete(id: string): Promise<CudSongResponseDto> {
        const song = await this.prisma.song
            .delete({ where: { id } })
            .catch((error) => {
                if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                    throw new SongNotFoundException();
                } else {
                    throw new InternalServerErrorException();
                }
            });

        // if song have an image, delete it
        if (song.imageId) this.uploadService.deleteFile(song.imageId);

        return song;
    }
}
