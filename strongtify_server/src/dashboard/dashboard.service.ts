import { Inject, Injectable } from "@nestjs/common";
import { AdminWebStatDto } from "./dtos/admin-web-stat.dto";
import { USER_SERVICES } from "src/resources/users/interfaces/constants";
import { PLAYLIST_SERVICES } from "src/resources/playlists/interfaces/constants";
import { StatisticPlaylistService } from "src/resources/playlists/interfaces/statistic-playlist-service.interface";
import { StatisticUserService } from "src/resources/users/interfaces/statistic-user-service.interface";
import { PrismaService } from "src/database/prisma.service";
import { UserListenResponseDto } from "./dtos/user-listen-response.dto";

@Injectable()
export class DashboardService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(USER_SERVICES.StatisticUserService)
        private readonly statisticUserService: StatisticUserService,
        @Inject(PLAYLIST_SERVICES.StatisticPlaylistService)
        private readonly statisticPlaylistService: StatisticPlaylistService,
    ) {}

    async getAdminWebStat(): Promise<AdminWebStatDto> {
        const newPlaylistTodayCountTask = this.statisticPlaylistService.countPlaylistsToday();
        const newUserTodayCountTask = this.statisticUserService.countNewUsersToday();
        const recentListenTask = this.getRecentListen(20);

        const result = await Promise.all([
            newPlaylistTodayCountTask,
            newUserTodayCountTask,
            recentListenTask,
        ]);

        return {
            newPlaylistTodayCount: result[0],
            newUserTodayCount: result[1],
            recentListens: result[2],
        };
    }

    private async getRecentListen(count: number): Promise<UserListenResponseDto[]> {
        const listens = await this.prisma.userListen.findMany({
            include: {
                song: {
                    include: {
                        artists: true,
                    }
                },
                user: true,
            },
            orderBy: {
                updatedAt: "desc",
            },
            take: count,
        });

        return listens;
    }
}