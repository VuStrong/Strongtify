import { Inject, Injectable } from "@nestjs/common";
import { AdminWebStatDto } from "./dtos/admin-web-stat.dto";
import { USER_SERVICES } from "src/resources/users/interfaces/constants";
import { PLAYLIST_SERVICES } from "src/resources/playlists/interfaces/constants";
import { StatisticPlaylistService } from "src/resources/playlists/interfaces/statistic-playlist-service.interface";
import { StatisticUserService } from "src/resources/users/interfaces/statistic-user-service.interface";
import { CACHE_SERVICE, CacheService } from "src/cache/interfaces/cache.interface";

@Injectable()
export class DashboardService {
    constructor(
        @Inject(USER_SERVICES.StatisticUserService)
        private readonly statisticUserService: StatisticUserService,
        @Inject(PLAYLIST_SERVICES.StatisticPlaylistService)
        private readonly statisticPlaylistService: StatisticPlaylistService,
        @Inject(CACHE_SERVICE) private readonly cacheService: CacheService,
    ) {}

    async getAdminWebStat(): Promise<AdminWebStatDto> {
        const newPlaylistTodayCountTask = this.statisticPlaylistService.countPlaylistsToday();
        const newUserTodayCountTask = this.statisticUserService.countNewUsersToday();
        const recentListenTask = this.cacheService.get("recent-listens");

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
}