import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UserListenService } from "../interfaces/user-listen-service.interface";
import { PrismaService } from "src/database/prisma.service";
import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { SongResponseDto } from "src/resources/songs/dtos/get/song-response.dto";
import { QueryParamDto } from "src/common/dtos/query-param.dto";
import { UserNotFoundException } from "../exceptions/user-not-found.exception";
import { PrismaError } from "src/database/enums/prisma-error.enum";

@Injectable()
export class UserListenServiceImpl implements UserListenService {
    constructor(private readonly prisma: PrismaService) {}

    async addToListen(userId: string, songId: string): Promise<boolean> {
        await this.prisma.userListen.upsert({
            where: {
                userId_songId: {
                    userId,
                    songId,
                },
            },
            update: {
                count: { increment: 1 },
            },
            create: {
                userId,
                songId,
            },
        }).catch(error => {
            if (error.code === PrismaError.FOREIGN_KEY_CONSTRAINT_FAILED) {
                throw new NotFoundException();
            }

            throw new InternalServerErrorException();
        });

        return true;
    }

    async removeFromListen(userId: string, songId: string): Promise<boolean> {
        await this.prisma.userListen.delete({
            where: {
                userId_songId: {
                    userId,
                    songId,
                }
            }
        }).catch(() => undefined);

        return true;
    }

    async getListenHistory(
        userId: string,
        params: QueryParamDto,
    ): Promise<PagedResponseDto<SongResponseDto>> {
        const { skip, take, allowCount } = params;

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                userListens: {
                    select: {
                        song: {
                            include: { artists: true },
                        },
                    },
                    orderBy: { updatedAt: "desc" },
                    skip,
                    take,
                },
                _count: allowCount && {
                    select: { userListens: true },
                },
            },
        });
        
        if (!user) throw new UserNotFoundException();

        return new PagedResponseDto<SongResponseDto>(
            user.userListens.map((ls) => ls.song),
            skip,
            take,
            user._count?.userListens ?? 0,
        );
    }
}
