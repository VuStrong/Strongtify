import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { GetSongService } from "../interfaces/get-song-service.interface";
import { PrismaService } from "src/database/prisma.service";
import { ArrayService } from "src/common/utils/array.service";
import { SongResponseDto } from "../dtos/get/song-response.dto";
import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { PagingParamDto } from "src/common/dtos/paging-param.dto";
import { Prisma } from "@prisma/client";
import { SongParamDto } from "../dtos/query-params/song-param.dto";
import { SongNotFoundException } from "../exceptions/song-not-found.exception";
import { SongDetailResponseDto } from "../dtos/get/song-detail-response.dto";

@Injectable()
export class GetSongServiceImpl implements GetSongService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly arrayService: ArrayService,
    ) {}

    async findByIdWithDetails(id: string): Promise<SongDetailResponseDto> {
        const song = await this.prisma.song.findUnique({
            where: { id },
            include: {
                artists: true,
                genres: true,
            },
        });

        if (!song) throw new SongNotFoundException();

        return song;
    }

    async get(
        params: SongParamDto,
    ): Promise<PagedResponseDto<SongResponseDto>> {
        const {
            skip,
            take,
            allowCount,
            sort: order,
            artistId,
            genreId,
            language,
        } = params;

        const filter: Prisma.SongWhereInput = {
            AND: {
                language,
                artists: artistId ? { some: { id: artistId } } : undefined,
                genres: genreId ? { some: { id: genreId } } : undefined,
            },
        };

        const songFindInputs: Prisma.SongFindManyArgs = {
            where: filter,
            orderBy: this.prisma.toPrismaOrderByObject(order),
            skip,
            take,
            include: {
                artists: true,
            },
        };

        try {
            if (allowCount) {
                const [songs, count] = await this.prisma.$transaction([
                    this.prisma.song.findMany(songFindInputs),
                    this.prisma.song.count({ where: filter }),
                ]);

                return new PagedResponseDto<SongResponseDto>(
                    songs,
                    skip,
                    take,
                    count,
                );
            } else {
                const songs = await this.prisma.song.findMany(songFindInputs);

                return new PagedResponseDto<SongResponseDto>(
                    songs,
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

    async search(
        value: string,
        pagingParams: PagingParamDto,
    ): Promise<PagedResponseDto<SongResponseDto>> {
        const { skip, take, allowCount } = pagingParams;

        value = value?.trim().toLowerCase();
        const filter: Prisma.SongWhereInput = {
            name: { contains: value },
        };

        const songFindInputs: Prisma.SongFindManyArgs = {
            where: filter,
            orderBy: [ {likeCount: "desc"}, {name: "desc"} ],
            skip,
            take,
            include: {
                artists: true,
            },
        };

        if (allowCount) {
            const [songs, count] = await this.prisma.$transaction([
                this.prisma.song.findMany(songFindInputs),
                this.prisma.song.count({ where: filter }),
            ]);

            return new PagedResponseDto<SongResponseDto>(
                songs,
                skip,
                take,
                count,
            );
        } else {
            const songs = await this.prisma.song.findMany(songFindInputs);

            return new PagedResponseDto<SongResponseDto>(songs, skip, take, 0);
        }
    }

    async getRandomSongs(count: number): Promise<SongResponseDto[]> {
        if (count <= 0) count = 1;

        const songCount = await this.prisma.song.count();
        let randomPos = Math.floor(Math.random() * songCount);

        if (randomPos + count > songCount) {
            randomPos -= randomPos + count - songCount;

            if (randomPos < 0) randomPos = 0;
        }

        const songs = await this.prisma.song.findMany({
            include: {
                artists: true,
            },
            skip: randomPos,
            take: count,
        });

        return this.arrayService.shuffle(songs);
    }
}
