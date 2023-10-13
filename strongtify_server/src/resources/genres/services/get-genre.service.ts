import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { GetGenreService } from "../interfaces/get-genre-service.interface";
import { GenreDetailParamDto } from "../dtos/query-params/genre-detail-param.dto";
import { GenreDetailResponseDto } from "../dtos/get/genre-detail-response.dto";
import { Prisma } from "@prisma/client";
import { PrismaError } from "src/database/enums/prisma-error.enum";
import { GenreNotFoundException } from "../exceptions/genre-not-found.exception";
import { GenreResponseDto } from "../dtos/get/genre-response.dto";
import { QueryParamDto } from "src/common/dtos/query-param.dto";
import { PagedResponseDto } from "src/common/dtos/paged-response.dto";

@Injectable()
export class GetGenreServiceImpl implements GetGenreService {
    constructor(private readonly prisma: PrismaService) {}

    async get(
        params: QueryParamDto,
    ): Promise<PagedResponseDto<GenreResponseDto>> {
        const { skip, take, allowCount, sort: order, keyword } = params;

        const filter: Prisma.GenreWhereInput = {
            name: keyword ? { contains: keyword.trim() } : undefined,
        };

        const genreFindInputs: Prisma.GenreFindManyArgs = {
            where: filter,
            orderBy: [
                this.prisma.toPrismaOrderByObject(order),
                { name: "asc" },
            ],
            skip,
            take,
        };

        try {
            if (allowCount) {
                const [genres, count] = await this.prisma.$transaction([
                    this.prisma.genre.findMany(genreFindInputs),
                    this.prisma.genre.count({ where: filter }),
                ]);

                return new PagedResponseDto<GenreResponseDto>(
                    genres,
                    skip,
                    take,
                    count,
                );
            } else {
                const genres = await this.prisma.genre.findMany(
                    genreFindInputs,
                );

                return new PagedResponseDto<GenreResponseDto>(
                    genres,
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

    async findByIdWithDetails(
        id: string,
        detailParams?: GenreDetailParamDto,
    ): Promise<GenreDetailResponseDto> {
        let includeQuery: Prisma.GenreInclude = undefined;

        if (detailParams) {
            const { songLimit, albumLimit } = detailParams;

            if (songLimit) {
                includeQuery = {
                    songs: {
                        orderBy: {
                            listenCount: "desc",
                        },
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
                        orderBy: {
                            likeCount: "desc",
                        },
                        include: {
                            artist: true,
                        },
                        take: albumLimit,
                    },
                };
            }
        }

        try {
            const genre = await this.prisma.genre.findUniqueOrThrow({
                where: { id },
                include: includeQuery,
            });

            return genre as GenreDetailResponseDto;
        } catch (error) {
            if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                throw new GenreNotFoundException();
            }
        }
    }

    async getRandomGenres(
        count: number,
        include?: Prisma.GenreInclude,
    ): Promise<GenreDetailResponseDto[]> {
        const genreCount = await this.prisma.genre.count();
        let randomPos = Math.floor(Math.random() * genreCount);

        if (randomPos + count > genreCount) {
            randomPos -= randomPos + count - genreCount;

            if (randomPos < 0) randomPos = 0;
        }

        return this.prisma.genre.findMany({
            include,
            skip: randomPos,
            take: count,
        });
    }
}
