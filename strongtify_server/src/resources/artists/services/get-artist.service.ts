import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { PrismaError } from "src/database/enums/prisma-error.enum";
import { GetArtistService } from "../interfaces/get-artist-service.interface";
import { ArtistNotFoundException } from "../exceptions/artist-not-found.exception";
import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { QueryParamDto } from "src/common/dtos/query-param.dto";
import { ArtistDetailParamDto } from "../dtos/query-params/artist-detail-param.dto";
import { ArtistResponseDto } from "../dtos/get/artist-response.dto";
import { ArtistDetailResponseDto } from "../dtos/get/artist-detail-response.dto";

@Injectable()
export class GetArtistServiceImpl implements GetArtistService {
    constructor(private readonly prisma: PrismaService) {}

    async findByIdWithDetails(
        id: string,
        detailParams?: ArtistDetailParamDto,
    ): Promise<ArtistDetailResponseDto> {
        let includeQuery: Prisma.ArtistInclude = undefined;

        if (detailParams) {
            const { songLimit, albumLimit } = detailParams;

            if (songLimit) {
                includeQuery = {
                    songs: {
                        include: {
                            artists: true,
                        },
                        take: songLimit,
                    },
                };
            }

            if (albumLimit) {
                includeQuery = {
                    ...includeQuery,
                    albums: {
                        include: {
                            artist: true,
                        },
                        take: albumLimit,
                    },
                };
            }

            includeQuery = {
                ...includeQuery,
                _count: {
                    select: {
                        songs: true,
                        albums: true,
                    },
                },
            };
        }

        try {
            const artist = await this.prisma.artist.findUniqueOrThrow({
                where: { id },
                include: includeQuery,
            });

            return {
                ...artist,
                songCount: artist._count?.songs,
                albumCount: artist._count?.albums,
            };
        } catch (error) {
            if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                throw new ArtistNotFoundException();
            }
        }
    }

    async get(
        artistParams: QueryParamDto,
    ): Promise<PagedResponseDto<ArtistResponseDto>> {
        const { skip, take, allowCount, sort: order, keyword } = artistParams;

        const filter: Prisma.ArtistWhereInput = {
            name: keyword ? { search: keyword.trim() } : undefined,
        };

        const artistFindInputs: Prisma.ArtistFindManyArgs = {
            where: filter,
            orderBy: keyword && !order ? {
                _relevance: {
                    fields: ['name'],
                    search: keyword,
                    sort: 'desc',
                },
            } : [
                this.prisma.toPrismaOrderByObject(order),
                { name: "asc" },
            ],
            skip,
            take,
        };

        try {
            if (allowCount) {
                const [artists, count] = await this.prisma.$transaction([
                    this.prisma.artist.findMany(artistFindInputs),
                    this.prisma.artist.count({ where: filter }),
                ]);

                return new PagedResponseDto<ArtistResponseDto>(
                    artists,
                    skip,
                    take,
                    count,
                );
            } else {
                const artists = await this.prisma.artist.findMany(
                    artistFindInputs,
                );

                return new PagedResponseDto<ArtistResponseDto>(
                    artists,
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
}
