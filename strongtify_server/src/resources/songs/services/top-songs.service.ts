import { Inject, Injectable } from "@nestjs/common";
import { TopSongsService } from "../interfaces/top-songs-service.interface";
import { PrismaService } from "src/database/prisma.service";
import {
    CACHE_SERVICE,
    CacheService,
} from "src/cache/interfaces/cache.interface";
import {
    Time,
    TopSongsParamDto,
} from "../dtos/query-params/top-songs-param.dto";
import { TopSongResponseDto } from "../dtos/get/top-song-response.dto";

@Injectable()
export class TopSongsServiceImpl implements TopSongsService {
    private readonly TOP_SONGS_COUNT = 10;

    constructor(
        private readonly prisma: PrismaService,
        @Inject(CACHE_SERVICE) private readonly cacheService: CacheService,
    ) {}

    async getTopSongs(params: TopSongsParamDto): Promise<TopSongResponseDto[]> {
        const { time } = params;

        const topSongsCached = await this.cacheService.get(`top-${time}-songs`);
        if (topSongsCached) {
            return topSongsCached;
        }

        const from = new Date();

        switch (time) {
            case Time.DAY:
                from.setDate(from.getDate() - 1);
                break;
            case Time.WEEK:
                from.setDate(from.getDate() - 7);
                break;
            case Time.MONTH:
                from.setMonth(from.getMonth() - 1);
                break;
            default:
                break;
        }

        const now = new Date().toISOString().split("T")[0] + "T00:00:00.000Z";
        const fromStr = from.toISOString().split("T")[0] + "T00:00:00.000Z";

        const listens = await this.prisma.listen.groupBy({
            by: ["songId"],
            where: {
                date: {
                    lte: now,
                    gte: fromStr,
                },
            },
            _sum: {
                count: true,
            },
            orderBy: {
                _sum: { count: "desc" },
            },
            take: this.TOP_SONGS_COUNT,
        });

        const songIds = listens.map((item) => item.songId);
        const songs = await this.prisma.song.findMany({
            where: {
                id: { in: songIds },
            },
            include: {
                artists: true,
            },
        });

        // convert songs array to object
        const songObjects = {};
        songs.forEach((song) => {
            songObjects[song.id] = song;
        });

        const topSongs: TopSongResponseDto[] = [];
        listens.forEach((listen) => {
            topSongs.push({
                listenCountInTimeRange: listen._sum.count,
                ...songObjects[listen.songId],
            });
        });

        // if top songs count less than TOP_SONGS_COUNT, add random songs to fill
        if (topSongs.length < this.TOP_SONGS_COUNT) {
            const songToAdd: any = await this.prisma.song.findMany({
                where: {
                    id: {
                        notIn: songIds,
                    },
                },
                include: {
                    artists: true,
                },
                take: this.TOP_SONGS_COUNT - topSongs.length,
            });

            songToAdd.forEach((song) => {
                topSongs.push({
                    listenCountInTimeRange: 0,
                    ...song,
                });
            });
        }

        await this.cacheService.set(
            `top-${time}-songs`,
            JSON.stringify(topSongs),
        );

        return topSongs;
    }
}
