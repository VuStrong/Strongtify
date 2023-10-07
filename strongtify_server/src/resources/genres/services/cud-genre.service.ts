import {
    Inject,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { CudGenreService } from "../interfaces/cud-genre-service.interface";
import { PrismaService } from "src/database/prisma.service";
import {
    UPLOAD_SERVICE,
    UploadService,
} from "src/upload/interfaces/upload.interface";
import { StringService } from "src/common/utils/string.service";
import { CreateGenreDto } from "../dtos/cud/create-genre.dto";
import { UploadFolder } from "src/upload/enums/folder.enum";
import { Prisma } from "@prisma/client";
import { GenreNotFoundException } from "../exceptions/genre-not-found.exception";
import { PrismaError } from "src/database/enums/prisma-error.enum";
import { UpdateGenreDto } from "../dtos/cud/update-genre.dto";
import { CudGenreResponseDto } from "../dtos/cud/cud-genre-response.dto";

@Injectable()
export class CudGenreServiceImpl implements CudGenreService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(UPLOAD_SERVICE) private readonly uploadService: UploadService,
        private readonly stringService: StringService,
    ) {}

    async create(createGenreDto: CreateGenreDto): Promise<CudGenreResponseDto> {
        const { image } = createGenreDto;
        delete createGenreDto.image;

        // upload image
        const uploadResponse =
            image &&
            (await this.uploadService
                .uploadFile(image, {
                    folder: UploadFolder.GENRE_IMAGE,
                })
                .catch(() => undefined));

        return this.prisma.genre
            .create({
                data: {
                    ...createGenreDto,
                    alias: this.stringService.slug(createGenreDto.name),
                    imageId: uploadResponse?.fileId,
                    imageUrl: uploadResponse?.url,
                },
            })
            .catch(() => {
                // if genre can not create, delete the image created
                if (uploadResponse)
                    this.uploadService.deleteFile(uploadResponse.fileId);

                throw new InternalServerErrorException();
            });
    }

    async update(params: {
        where: Prisma.GenreWhereUniqueInput;
        data: UpdateGenreDto;
    }): Promise<CudGenreResponseDto> {
        const { where, data } = params;
        const { image } = data;
        delete data.image;

        // if not upload image, then no need to query old genre to compare later
        const oldGenre =
            image &&
            (await this.prisma.genre
                .findUniqueOrThrow({
                    where,
                    select: { imageId: true },
                })
                .catch(() => {
                    throw new GenreNotFoundException();
                }));

        // upload image
        const uploadResponse =
            image &&
            (await this.uploadService
                .uploadFile(image, {
                    folder: UploadFolder.GENRE_IMAGE,
                })
                .catch(() => undefined));

        const updatedGenre = await this.prisma.genre
            .update({
                where,
                data: {
                    ...data,
                    alias: this.stringService.slug(data.name),
                    imageId: uploadResponse?.fileId,
                    imageUrl: uploadResponse?.url,
                },
            })
            .catch((error) => {
                // if genre can not update, delete the image created
                if (uploadResponse)
                    this.uploadService.deleteFile(uploadResponse.fileId);

                if (
                    error?.code === PrismaError.ENTITY_NOT_FOUND ||
                    error?.code === PrismaError.QUERY_INTERPRETATION_ERROR
                ) {
                    throw new GenreNotFoundException();
                } else {
                    throw new InternalServerErrorException();
                }
            });

        // if genre updated, delete the old image if it exist
        if (oldGenre?.imageId && updatedGenre.imageId !== oldGenre.imageId)
            this.uploadService.deleteFile(oldGenre.imageId);

        return updatedGenre;
    }

    async delete(id: string): Promise<CudGenreResponseDto> {
        const genre = await this.prisma.genre
            .delete({ where: { id } })
            .catch((error) => {
                if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                    throw new GenreNotFoundException();
                } else {
                    throw new InternalServerErrorException();
                }
            });

        // if genre have an image, delete it
        if (genre.imageId) this.uploadService.deleteFile(genre.imageId);

        return genre;
    }
}
