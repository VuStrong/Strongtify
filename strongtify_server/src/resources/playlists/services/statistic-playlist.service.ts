import { Injectable } from "@nestjs/common";
import { StatisticPlaylistService } from "../interfaces/statistic-playlist-service.interface";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class StatisticPlaylistServiceImpl implements StatisticPlaylistService {
    constructor(private readonly prisma: PrismaService) {}
    
    async countPlaylistsToday(): Promise<number> {
        const from = new Date();
        const fromStr = from.toISOString().split("T")[0] + "T00:00:00.000Z";
        from.setDate(from.getDate() + 1);
        const toStr = from.toISOString().split("T")[0] + "T00:00:00.000Z";

        return this.prisma.playlist.count({
            where: {
                createdAt: {
                    lte: toStr,
                    gte: fromStr,
                }
            }
        });
    }
}