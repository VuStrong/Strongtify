import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { AlbumNotFoundException } from "../exceptions/album-not-found.exception";
import { GetAlbumService } from "../interfaces/get-album-service.interface";
import { ArrayService } from "src/common/utils/array.service";
import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { AlbumParamDto } from "../dtos/query-params/album-param.dto";
import { AlbumDetailResponseDto } from "../dtos/get/album-detail-response.dto";
import { PagingParamDto } from "src/common/dtos/paging-param.dto";
import { AlbumResponseDto } from "../dtos/get/album-response.dto";

@Injectable()
export class GetAlbumServiceImpl implements GetAlbumService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly arrayService: ArrayService,
    ) {}

    async findByIdWithSongs(id: string): Promise<AlbumDetailResponseDto> {
        const album = await this.prisma.album.findUnique({
            where: { id },
            include: {
                artist: true,
                genres: true,
                songs: {
                    include: {
                        song: {
                            include: {
                                artists: true,
                            },
                        },
                    },
                    orderBy: { order: "asc" },
                },
            },
        });

        if (!album) throw new AlbumNotFoundException();

        return album;
    }

    async get(
        params: AlbumParamDto,
    ): Promise<PagedResponseDto<AlbumResponseDto>> {
        const {
            skip,
            take,
            allowCount,
            sort: order,
            artistId,
            genreId,
        } = params;

        const filter: Prisma.AlbumWhereInput = {
            AND: {
                artistId: artistId === "null" ? null : artistId,
                genres: genreId ? { some: { id: genreId } } : undefined,
            },
        };

        const albumFindInputs: Prisma.AlbumFindManyArgs = {
            where: filter,
            orderBy: this.prisma.toPrismaOrderByObject(order),
            skip,
            take,
            include: {
                artist: true,
            },
        };

        try {
            if (allowCount) {
                const [albums, count] = await this.prisma.$transaction([
                    this.prisma.album.findMany(albumFindInputs),
                    this.prisma.album.count({ where: filter }),
                ]);

                return new PagedResponseDto<AlbumResponseDto>(
                    albums,
                    skip,
                    take,
                    count,
                );
            } else {
                const albums = await this.prisma.album.findMany(
                    albumFindInputs,
                );

                return new PagedResponseDto<AlbumResponseDto>(
                    albums,
                    skip,
                    take,
                    0,
                );
            }
        } catch (error) {
            if (error instanceof Prisma.PrismaClientValidationError) {
                throw new BadRequestException("Invalid query params.");
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async getRandomAlbums(count: number): Promise<AlbumResponseDto[]> {
        if (count <= 0) count = 1;

        const albumCount = await this.prisma.album.count();
        let randomPos = Math.floor(Math.random() * albumCount);

        if (randomPos + count > albumCount) {
            randomPos -= randomPos + count - albumCount;

            if (randomPos < 0) randomPos = 0;
        }

        const albums = await this.prisma.album.findMany({
            include: {
                artist: true,
            },
            skip: randomPos,
            take: count,
        });

        return this.arrayService.shuffle(albums);
    }

    async search(
        value: string,
        pagingParams: PagingParamDto,
    ): Promise<PagedResponseDto<AlbumResponseDto>> {
        const { skip, take, allowCount } = pagingParams;

        value = value?.trim().toLowerCase();
        const filter: Prisma.AlbumWhereInput = {
            name: { contains: value },
        };

        const albumFindInputs: Prisma.AlbumFindManyArgs = {
            where: filter,
            orderBy: [ {likeCount: "desc"}, {name: "desc"} ],
            skip,
            take,
            include: {
                artist: true,
            },
        };

        if (allowCount) {
            const [albums, count] = await this.prisma.$transaction([
                this.prisma.album.findMany(albumFindInputs),
                this.prisma.album.count({ where: filter }),
            ]);

            return new PagedResponseDto<AlbumResponseDto>(
                albums,
                skip,
                take,
                count,
            );
        } else {
            const albums = await this.prisma.album.findMany(albumFindInputs);

            return new PagedResponseDto<AlbumResponseDto>(
                albums,
                skip,
                take,
                0,
            );
        }
    }
}
