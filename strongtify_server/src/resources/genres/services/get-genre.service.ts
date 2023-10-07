import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { GetGenreService } from "../interfaces/get-genre-service.interface";
import { GenreDetailParamDto } from "../dtos/query-params/genre-detail-param.dto";
import { GenreDetailResponseDto } from "../dtos/get/genre-detail-response.dto";
import { Prisma } from "@prisma/client";
import { PrismaError } from "src/database/enums/prisma-error.enum";
import { GenreNotFoundException } from "../exceptions/genre-not-found.exception";
import { GenreResponseDto } from "../dtos/get/genre-response.dto";

@Injectable()
export class GetGenreServiceImpl implements GetGenreService {
    constructor(private readonly prisma: PrismaService) {}

    async getAll(): Promise<GenreResponseDto[]> {
        return this.prisma.genre.findMany({
            orderBy: { name: "asc" },
        });
    }

    async search(value: string): Promise<GenreResponseDto[]> {
        value = value?.trim().toLowerCase();

        return this.prisma.genre.findMany({
            where: {
                name: { contains: value },
            },
            orderBy: { name: "asc" },
        });
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
