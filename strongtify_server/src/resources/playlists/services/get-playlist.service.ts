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
import { PagingParamDto } from "src/common/dtos/paging-param.dto";
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

        return playlist;
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
            userRequestId,
        } = params;

        const filter: Prisma.PlaylistWhereInput = {
            userId,
            status,
            NOT: {
                userId: {
                    not: userRequestId,
                },
                status: PlaylistStatus.PRIVATE,
            },
        };

        const playlistFindInputs: Prisma.PlaylistFindManyArgs = {
            where: filter,
            orderBy: this.prisma.toPrismaOrderByObject(order),
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

    async search(
        value: string,
        pagingParams: PagingParamDto,
    ): Promise<PagedResponseDto<PlaylistResponseDto>> {
        const { skip, take, allowCount } = pagingParams;

        value = value?.trim().toLowerCase();
        const filter: Prisma.PlaylistWhereInput = {
            AND: {
                name: { contains: value },
                status: PlaylistStatus.PUBLIC,
            },
        };

        const playlistFindInputs: Prisma.PlaylistFindManyArgs = {
            where: filter,
            orderBy: [ {likeCount: "desc"}, {name: "desc"} ],
            skip,
            take,
            include: {
                user: true,
            },
        };

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
    }
}
