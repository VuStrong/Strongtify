import { Injectable } from "@nestjs/common";
import { StatisticUserService } from "../interfaces/statistic-user-service.interface";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class StatisticUserServiceImpl implements StatisticUserService {
    constructor(private readonly prisma: PrismaService) {}

    async countNewUsersToday(): Promise<number> {
        const from = new Date();
        const fromStr = from.toISOString().split("T")[0] + "T00:00:00.000Z";
        from.setDate(from.getDate() + 1);
        const toStr = from.toISOString().split("T")[0] + "T00:00:00.000Z";

        return this.prisma.user.count({
            where: {
                createdAt: {
                    lte: toStr,
                    gte: fromStr,
                }
            }
        });
    }
}