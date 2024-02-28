import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { GetSongService } from "../interfaces/get-song-service.interface";
import { PrismaService } from "src/database/prisma.service";
import { ArrayService } from "src/common/utils/array.service";
import { SongResponseDto } from "../dtos/get/song-response.dto";
import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
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

        const keyword = params.keyword?.trim();

        const filter: Prisma.SongWhereInput = {
            AND: {
                OR: keyword ? [
                    { 
                        name: { search: keyword } 
                    },
                    {
                        artists: {
                            some: { name: { search: keyword } }
                        }
                    }
                ] : undefined,
                language,
                artists: artistId ? { some: { id: artistId } } : undefined,
                genres: genreId ? { some: { id: genreId } } : undefined,
            },
        };

        const songFindInputs: Prisma.SongFindManyArgs = {
            where: filter,
            orderBy: [
                keyword && !order ? 
                    {
                        _relevance: {
                            fields: ['name'],
                            search: keyword,
                            sort: 'desc',
                        }
                    } : 
                    this.prisma.toPrismaOrderByObject(order),
                { name: "asc" },
            ],
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
