import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { LikePlaylistService } from "../../interfaces/like-and-follow/like-playlist-service.interface";
import { PrismaService } from "src/database/prisma.service";
import { PlaylistNotFoundException } from "src/resources/playlists/exceptions/playlist-not-found.exception";
import { PrismaError } from "src/database/enums/prisma-error.enum";
import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { PlaylistResponseDto } from "src/resources/playlists/dtos/get/playlist-response.dto";
import { PlaylistStatus } from "@prisma/client";
import { PagingParamDto } from "src/common/dtos/paging-param.dto";
import { UserNotFoundException } from "../../exceptions/user-not-found.exception";

@Injectable()
export class LikePlaylistServiceImpl implements LikePlaylistService {
    constructor(private readonly prisma: PrismaService) {}

    async getLikedPlaylists(
        userId: string,
        pagingParams: PagingParamDto,
    ): Promise<PagedResponseDto<PlaylistResponseDto>> {
        const { skip, take, allowCount } = pagingParams;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                likedPlaylists: {
                    where: {
                        playlist: { status: PlaylistStatus.PUBLIC },
                    },
                    select: {
                        playlist: {
                            include: { user: true },
                        },
                    },
                    orderBy: { likedAt: "desc" },
                    skip,
                    take,
                },
                _count: allowCount && {
                    select: {
                        likedPlaylists: {
                            where: {
                                playlist: { status: PlaylistStatus.PUBLIC },
                            },
                        },
                    },
                },
            },
        });

        if (!user) throw new UserNotFoundException();

        return new PagedResponseDto<PlaylistResponseDto>(
            user.likedPlaylists.map((lp) => lp.playlist),
            skip,
            take,
            user._count?.likedPlaylists ?? 0,
        );
    }

    async likePlaylist(userId: string, playlistId: string): Promise<boolean> {
        if (!userId || !playlistId)
            throw new BadRequestException(
                "userId or playlistId should not empty",
            );

        await this.prisma
            .$transaction([
                this.prisma.userPlaylist.create({
                    data: {
                        user: { connect: { id: userId } },
                        playlist: { connect: { id: playlistId } },
                    },
                }),
                this.prisma.playlist.update({
                    where: { id: playlistId },
                    data: { likeCount: { increment: 1 } },
                }),
            ])
            .catch((error) => {
                if (
                    error?.code === PrismaError.ENTITY_NOT_FOUND ||
                    error?.code === PrismaError.QUERY_INTERPRETATION_ERROR
                ) {
                    throw new PlaylistNotFoundException();
                } else if (
                    error?.code === PrismaError.UNIQUE_CONSTRAINT_FAILED
                ) {
                } else {
                    throw new InternalServerErrorException();
                }
            });

        return true;
    }

    async unlikePlaylist(userId: string, playlistId: string): Promise<boolean> {
        if (!userId || !playlistId)
            throw new BadRequestException(
                "userId or playlistId should not empty",
            );

        await this.prisma
            .$transaction([
                this.prisma.userPlaylist.delete({
                    where: {
                        userId_playlistId: { userId, playlistId },
                    },
                }),
                this.prisma.playlist.update({
                    where: { id: playlistId },
                    data: { likeCount: { decrement: 1 } },
                }),
            ])
            .catch((error) => {
                if (
                    error?.code === PrismaError.ENTITY_NOT_FOUND ||
                    error?.code === PrismaError.QUERY_INTERPRETATION_ERROR
                ) {
                    throw new PlaylistNotFoundException();
                } else {
                    throw new InternalServerErrorException();
                }
            });

        return true;
    }

    async checkLikedPlaylist(userId: string, playlistId: string) {
        try {
            await this.prisma.userPlaylist.findUniqueOrThrow({
                where: { userId_playlistId: { userId, playlistId } },
            });

            return true;
        } catch (error) {
            return false;
        }
    }
}
