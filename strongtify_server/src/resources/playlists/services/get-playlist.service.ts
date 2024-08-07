import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { GetPlaylistService } from "../interfaces/get-playlist-service.interface";
import { PrismaService } from "src/database/prisma.service";
import { PlaylistDetailResponseDto } from "../dtos/get/playlist-detail-response.dto";
import { PlaylistNotFoundException } from "../exceptions/playlist-not-found.exception";
import { PlaylistParamDto } from "../dtos/query-params/playlist-param.dto";
import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { PlaylistStatus, Prisma } from "@prisma/client";
import { PlaylistResponseDto } from "../dtos/get/playlist-response.dto";

@Injectable()
export class GetPlaylistServiceImpl implements GetPlaylistService {
    constructor(private readonly prisma: PrismaService) {}

    async findByIdWithSongs(id: string): Promise<PlaylistDetailResponseDto> {
        const playlist = await this.prisma.playlist.findUnique({
            where: { id },
            include: {
                user: true,
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

        if (!playlist) throw new PlaylistNotFoundException();

        let songCount = 0, totalLength = 0;

        playlist.songs.forEach((song) => {
            songCount++;
            totalLength += song.song.length;
        });

        return {
            ...playlist,
            songCount,
            totalLength,
        };
    }

    async get(
        params: PlaylistParamDto,
    ): Promise<PagedResponseDto<PlaylistResponseDto>> {
        const {
            skip,
            take,
            allowCount,
            sort: order,
            userId,
            status,
        } = params;
        let keyword = params.keyword?.trim();
        if (keyword) keyword = keyword + '*';

        // auto restrict playlist if not set
        const restrictOptions = params.restrictOptions || {
            restrict: true
        }

        const filter: Prisma.PlaylistWhereInput = {
            name: keyword ? { search: keyword } : undefined,
            description: keyword ? { search: keyword } : undefined,
            userId,
            status,
            NOT: restrictOptions.restrict ? {
                status: PlaylistStatus.PRIVATE,
                userId: {
                    not: restrictOptions.userIdToRestrict,
                },
            } : undefined,
        };

        const playlistFindInputs: Prisma.PlaylistFindManyArgs = {
            where: filter,
            orderBy: [
                keyword && !order ? 
                    {
                        _relevance: {
                            fields: ['name', 'description'],
                            search: keyword,
                            sort: 'desc',
                        }
                    } : 
                    this.prisma.toPrismaOrderByObject(order),
                { id: "asc" },
            ],
            skip,
            take,
            include: {
                user: true,
            },
        };

        try {
            if (allowCount) {
                const [playlists, count] = await this.prisma.$transaction([
                    this.prisma.playlist.findMany(playlistFindInputs),
                    this.prisma.playlist.count({ where: filter }),
                ]);

                return new PagedResponseDto<PlaylistResponseDto>(
                    playlists,
                    skip,
                    take,
                    count,
                );
            } else {
                const playlists = await this.prisma.playlist.findMany(
                    playlistFindInputs,
                );

                return new PagedResponseDto<PlaylistResponseDto>(
                    playlists,
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
