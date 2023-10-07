import { Injectable } from "@nestjs/common";
import { RecommendService } from "../interfaces/recommend-service.interface";
import { PrismaService } from "src/database/prisma.service";
import { AlbumResponseDto } from "src/resources/albums/dtos/get/album-response.dto";

@Injectable()
export class RecommendServiceImpl implements RecommendService {
    constructor(private readonly prisma: PrismaService) {}

    async getUserRecommendedAlbums(
        userId: string,
        count: number,
    ): Promise<AlbumResponseDto[]> {
        if (!userId) return [];

        // simply take liked albums, songs of user and find another have the same genres :<
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                likedAlbums: {
                    select: {
                        album: {
                            select: {
                                genres: {
                                    select: { id: true },
                                },
                            },
                        },
                    },
                    orderBy: { likedAt: "desc" },
                    take: 10,
                },
                likedSongs: {
                    select: {
                        song: {
                            select: {
                                genres: {
                                    select: { id: true },
                                },
                            },
                        },
                    },
                    orderBy: { likedAt: "desc" },
                    take: 10,
                },
            },
        });

        if (!user) return [];

        const genreIdsObject = {};

        user.likedAlbums.forEach((likedAlbum) => {
            likedAlbum.album.genres?.forEach((g) => {
                if (genreIdsObject[g.id]) genreIdsObject[g.id] += 1;
                else genreIdsObject[g.id] = 1;
            });
        });

        user.likedSongs.forEach((likedSong) => {
            likedSong.song.genres?.forEach((g) => {
                if (genreIdsObject[g.id]) genreIdsObject[g.id] += 1;
                else genreIdsObject[g.id] = 1;
            });
        });

        // convert genreIds to array and sort by key, and take first 2 elements
        const sortable = Object.entries(genreIdsObject)
            .sort((a: any, b: any) => b[1] - a[1])
            .map((a) => a[0])
            .slice(0, 2);

        let recommendedAlbums = await this.prisma.album.findMany({
            where: {
                genres: {
                    some: { id: { in: sortable } },
                },
            },
            include: {
                artist: true,
            },
            orderBy: { likeCount: "desc" },
            take: count,
        });

        if (recommendedAlbums.length < count) {
            recommendedAlbums = recommendedAlbums.concat(
                await this.prisma.album.findMany({
                    where: {
                        id: { notIn: recommendedAlbums.map((a) => a.id) },
                    },
                    include: {
                        artist: true,
                    },
                    take: count - recommendedAlbums.length,
                }),
            );
        }

        return recommendedAlbums;
    }
}
