import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { LikeSongService } from "../../interfaces/like-and-follow/like-song-service.interface";
import { PrismaService } from "src/database/prisma.service";
import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { SongResponseDto } from "src/resources/songs/dtos/get/song-response.dto";
import { QueryParamDto } from "src/common/dtos/query-param.dto";
import { UserNotFoundException } from "../../exceptions/user-not-found.exception";
import { SongNotFoundException } from "src/resources/songs/exceptions/song-not-found.exception";
import { PrismaError } from "src/database/enums/prisma-error.enum";

@Injectable()
export class LikeSongServiceImpl implements LikeSongService {
    constructor(private readonly prisma: PrismaService) {}

    async getLikedSongs(
        userId: string,
        params: QueryParamDto,
    ): Promise<PagedResponseDto<SongResponseDto>> {
        const { skip, take, allowCount } = params;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                likedSongs: {
                    select: {
                        song: {
                            include: { artists: true },
                        },
                    },
                    orderBy: { likedAt: "desc" },
                    skip,
                    take,
                },
                _count: allowCount && {
                    select: { likedSongs: true },
                },
            },
        });

        if (!user) throw new UserNotFoundException();

        return new PagedResponseDto<SongResponseDto>(
            user.likedSongs.map((ls) => ls.song),
            skip,
            take,
            user._count?.likedSongs ?? 0,
        );
    }

    async likeSong(userId: string, songId: string): Promise<boolean> {
        if (!userId || !songId)
            throw new BadRequestException("userId or songId should not empty");

        await this.prisma
            .$transaction([
                this.prisma.userSong.create({
                    data: {
                        user: { connect: { id: userId } },
                        song: { connect: { id: songId } },
                    },
                }),
                this.prisma.song.update({
                    where: { id: songId },
                    data: { likeCount: { increment: 1 } },
                }),
            ])
            .catch((error) => {
                if (
                    error?.code === PrismaError.ENTITY_NOT_FOUND ||
                    error?.code === PrismaError.QUERY_INTERPRETATION_ERROR
                ) {
                    throw new SongNotFoundException();
                } else if (
                    error?.code === PrismaError.UNIQUE_CONSTRAINT_FAILED
                ) {
                } else {
                    throw new InternalServerErrorException();
                }
            });

        return true;
    }

    async unlikeSong(userId: string, songId: string): Promise<boolean> {
        if (!userId || !songId)
            throw new BadRequestException("userId or songId should not empty");

        await this.prisma
            .$transaction([
                this.prisma.userSong.delete({
                    where: {
                        userId_songId: { userId, songId },
                    },
                }),
                this.prisma.song.update({
                    where: { id: songId },
                    data: { likeCount: { decrement: 1 } },
                }),
            ])
            .catch((error) => {
                if (
                    error?.code === PrismaError.ENTITY_NOT_FOUND ||
                    error?.code === PrismaError.QUERY_INTERPRETATION_ERROR
                ) {
                    throw new SongNotFoundException();
                } else {
                    throw new InternalServerErrorException();
                }
            });

        return true;
    }

    async checkLikedSong(userId: string, songId: string) {
        try {
            await this.prisma.userSong.findUniqueOrThrow({
                where: { userId_songId: { userId, songId } },
            });

            return true;
        } catch (error) {
            return false;
        }
    }
}
