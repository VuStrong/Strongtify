import {
    Inject,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaError } from "src/database/enums/prisma-error.enum";
import { PrismaService } from "src/database/prisma.service";
import { UploadFolder } from "src/upload/enums/folder.enum";
import { StringService } from "src/common/utils/string.service";
import {
    UPLOAD_SERVICE,
    UploadService,
} from "src/upload/interfaces/upload.interface";
import { CudArtistService } from "../interfaces/cud-artist-service.interface";
import { ArtistNotFoundException } from "../exceptions/artist-not-found.exception";
import { CreateArtistDto } from "../dtos/cud/create-artist.dto";
import { UpdateArtistDto } from "../dtos/cud/update-artist.dto";
import { CudArtistResponseDto } from "../dtos/cud/cud-artist-response.dto";

@Injectable()
export class CudArtistServiceImpl implements CudArtistService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(UPLOAD_SERVICE) private readonly uploadService: UploadService,
        private readonly stringService: StringService,
    ) {}

    async create(
        createArtistDto: CreateArtistDto,
    ): Promise<CudArtistResponseDto> {
        const { image } = createArtistDto;
        delete createArtistDto.image;

        // upload image
        const uploadResponse =
            image &&
            (await this.uploadService
                .uploadFile(image, {
                    folder: UploadFolder.ARTIST_IMAGE,
                })
                .catch(() => undefined));

        return this.prisma.artist
            .create({
                data: {
                    ...createArtistDto,
                    alias: this.stringService.slug(createArtistDto.name),
                    imageId: uploadResponse?.fileId,
                    imageUrl: uploadResponse?.url,
                },
            })
            .catch(() => {
                // if artist can not create, delete the image created
                if (uploadResponse)
                    this.uploadService.deleteFile(uploadResponse.fileId);

                throw new InternalServerErrorException();
            });
    }

    async update(params: {
        where: Prisma.ArtistWhereUniqueInput;
        data: UpdateArtistDto;
    }): Promise<CudArtistResponseDto> {
        const { where, data } = params;
        const { image } = data;
        delete data.image;

        // if not upload image, then no need to query old artist to compare later
        const oldArtist =
            image &&
            (await this.prisma.artist
                .findUniqueOrThrow({
                    where,
                    select: { imageId: true },
                })
                .catch(() => {
                    throw new ArtistNotFoundException();
                }));

        // upload image
        const uploadResponse =
            image &&
            (await this.uploadService
                .uploadFile(image, {
                    folder: UploadFolder.ARTIST_IMAGE,
                })
                .catch(() => undefined));

        const updatedArtist = await this.prisma.artist
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
                // if artist can not update, delete the image created
                if (uploadResponse)
                    this.uploadService.deleteFile(uploadResponse.fileId);

                if (
                    error?.code === PrismaError.ENTITY_NOT_FOUND ||
                    error?.code === PrismaError.QUERY_INTERPRETATION_ERROR
                ) {
                    throw new ArtistNotFoundException();
                } else {
                    throw new InternalServerErrorException();
                }
            });

        // if artist updated, delete the old image if it exist
        if (oldArtist?.imageId && updatedArtist.imageId !== oldArtist.imageId)
            this.uploadService.deleteFile(oldArtist.imageId);

        return updatedArtist;
    }

    async delete(id: string): Promise<CudArtistResponseDto> {
        const artist = await this.prisma.artist
            .delete({ where: { id } })
            .catch((error) => {
                if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                    throw new ArtistNotFoundException();
                } else {
                    throw new InternalServerErrorException();
                }
            });

        // if artist have an image, delete it
        if (artist.imageId) this.uploadService.deleteFile(artist.imageId);

        return artist;
    }
}
