import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { SongListenService } from "../interfaces/song-listen-service.interface";
import { PrismaService } from "src/database/prisma.service";
import { SongNotFoundException } from "../exceptions/song-not-found.exception";
import { PrismaError } from "src/database/enums/prisma-error.enum";

@Injectable()
export class SongListenServiceImpl implements SongListenService {
    constructor(private readonly prisma: PrismaService) {}

    async increaseListenCount(id: string): Promise<boolean> {
        const today = new Date();
        // set time of today to zero, so prisma don't throw error
        const todayStr = today.toISOString().split("T")[0] + "T00:00:00.000Z";

        await this.prisma
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

        return true;
    }
}
