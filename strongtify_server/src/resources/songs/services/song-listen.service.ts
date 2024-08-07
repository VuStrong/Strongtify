import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { SongListenService } from "../interfaces/song-listen-service.interface";
import { PrismaService } from "src/database/prisma.service";
import { SongNotFoundException } from "../exceptions/song-not-found.exception";
import { PrismaError } from "src/database/enums/prisma-error.enum";
import { CACHE_SERVICE, CacheService } from "src/cache/interfaces/cache.interface";
import { Song } from "@prisma/client";
import { USER_SERVICES } from "src/resources/users/interfaces/constants";
import { UserListenService } from "src/resources/users/interfaces/user-listen-service.interface";

@Injectable()
export class SongListenServiceImpl implements SongListenService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(CACHE_SERVICE) private readonly cacheService: CacheService,
        @Inject(USER_SERVICES.UserListenService) 
        private readonly userListenService: UserListenService,
    ) {}

    async increaseListenCount(
        id: string,
        metadata?: {
            userId?: string;
            ip?: string;
        },
    ): Promise<void> {
        const today = new Date();
        // set time of today to zero, so prisma don't throw error
        const todayStr = today.toISOString().split("T")[0] + "T00:00:00.000Z";

        const [song] = await this.prisma
            .$transaction([
                this.prisma.song.update({
                    where: { id },
                    data: {
                        listenCount: { increment: 1 },
                    },
                }),
                this.prisma.listen.upsert({
                    where: {
                        songId_date: {
                            songId: id,
                            date: todayStr,
                        },
                    },
                    update: {
                        count: { increment: 1 },
                    },
                    create: {
                        songId: id,
                        date: todayStr,
                    },
                }),
            ])
            .catch((error) => {
                if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                    throw new SongNotFoundException();
                } else {
                    throw new InternalServerErrorException();
                }
            });

        if (metadata?.userId) {
            await this.userListenService.addToListen(metadata.userId, id);
        }

        this.saveListenToRedis(song, metadata.userId, metadata.ip);
    }

    private async saveListenToRedis(song: Song, userId?: string, ip?: string) {
        const listens: any[] = (await this.cacheService.get("recent-listens")) ?? [];

        if (listens.length >= 50) {
            listens.splice(49);
        }

        listens.unshift({
            song,
            at: new Date(),
            userId: userId || "NONE",
            ip: ip || "NONE",
        });

        await this.cacheService.set("recent-listens", JSON.stringify(listens), 604800);
    }
}
