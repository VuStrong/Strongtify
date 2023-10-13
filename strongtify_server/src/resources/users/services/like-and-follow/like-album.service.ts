import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { LikeAlbumService } from "../../interfaces/like-and-follow/like-album-service.interface";
import { AlbumNotFoundException } from "src/resources/albums/exceptions/album-not-found.exception";
import { PrismaError } from "src/database/enums/prisma-error.enum";
import { PrismaService } from "src/database/prisma.service";
import { QueryParamDto } from "src/common/dtos/query-param.dto";
import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { AlbumResponseDto } from "src/resources/albums/dtos/get/album-response.dto";
import { UserNotFoundException } from "../../exceptions/user-not-found.exception";

@Injectable()
export class LikeAlbumServiceImpl implements LikeAlbumService {
    constructor(private readonly prisma: PrismaService) {}

    async getLikedAlbums(
        userId: string,
        params: QueryParamDto,
    ): Promise<PagedResponseDto<AlbumResponseDto>> {
        const { skip, take, allowCount } = params;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                likedAlbums: {
                    select: {
                        album: {
                            include: { artist: true },
                        },
                    },
                    orderBy: { likedAt: "desc" },
                    skip,
                    take,
                },
                _count: allowCount && {
                    select: { likedAlbums: true },
                },
            },
        });

        if (!user) throw new UserNotFoundException();

        return new PagedResponseDto<AlbumResponseDto>(
            user.likedAlbums.map((a) => a.album),
            skip,
            take,
            user._count?.likedAlbums ?? 0,
        );
    }

    async likeAlbum(userId: string, albumId: string): Promise<boolean> {
        if (!userId || !albumId)
            throw new BadRequestException("userId or albumId should not empty");

        await this.prisma
            .$transaction([
                this.prisma.userAlbum.create({
                    data: {
                        user: { connect: { id: userId } },
                        album: { connect: { id: albumId } },
                    },
                }),
                this.prisma.album.update({
                    where: { id: albumId },
                    data: { likeCount: { increment: 1 } },
                }),
            ])
            .catch((error) => {
                if (
                    error?.code === PrismaError.ENTITY_NOT_FOUND ||
                    error?.code === PrismaError.QUERY_INTERPRETATION_ERROR
                ) {
                    throw new AlbumNotFoundException();
                } else if (
                    error?.code === PrismaError.UNIQUE_CONSTRAINT_FAILED
                ) {
                } else {
                    throw new InternalServerErrorException();
                }
            });

        return true;
    }

    async unlikeAlbum(userId: string, albumId: string): Promise<boolean> {
        if (!userId || !albumId)
            throw new BadRequestException("userId or albumId should not empty");

        await this.prisma
            .$transaction([
                this.prisma.userAlbum.delete({
                    where: {
                        userId_albumId: { userId, albumId },
                    },
                }),
                this.prisma.album.update({
                    where: { id: albumId },
                    data: { likeCount: { decrement: 1 } },
                }),
            ])
            .catch((error) => {
                if (
                    error?.code === PrismaError.ENTITY_NOT_FOUND ||
                    error?.code === PrismaError.QUERY_INTERPRETATION_ERROR
                ) {
                    throw new AlbumNotFoundException();
                } else {
                    throw new InternalServerErrorException();
                }
            });

        return true;
    }

    async checkLikedAlbum(userId: string, albumId: string): Promise<boolean> {
        try {
            await this.prisma.userAlbum.findUniqueOrThrow({
                where: { userId_albumId: { userId, albumId } },
            });

            return true;
        } catch (error) {
            return false;
        }
    }
}
