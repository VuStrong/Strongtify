import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { ManagePlaylistSongsService } from "../interfaces/manage-playlist-songs-service.interface";
import { PrismaService } from "src/database/prisma.service";
import { Prisma } from "@prisma/client";
import { PrismaError } from "src/database/enums/prisma-error.enum";

@Injectable()
export class ManagePlaylistSongsServiceImpl
    implements ManagePlaylistSongsService
{
    constructor(private readonly prisma: PrismaService) {}

    async addSongsToPlaylist(
        playlistId: string,
        songIds: string[],
    ): Promise<boolean> {
        if (!songIds || songIds.length === 0) return;

        await this.prisma
            .$transaction(async (tx) => {
                const playlist = await tx.playlist.findUniqueOrThrow({
                    where: { id: playlistId },
                    select: { songCount: true, totalLength: true },
                });
                const playlistSongsToAdd: Prisma.Enumerable<Prisma.PlaylistSongCreateManyInput> =
                    [];

                for (const songId of songIds) {
                    const song = await tx.song.findUniqueOrThrow({
                        where: { id: songId },
                        select: { length: true },
                    });

                    playlist.songCount += 1;
                    playlist.totalLength += song.length;

                    playlistSongsToAdd.push({
                        playlistId,
                        songId,
                        order: playlist.songCount,
                    });
                }

                await tx.playlistSong.createMany({
                    data: playlistSongsToAdd,
                });

                await tx.playlist.update({
                    where: { id: playlistId },
                    data: {
                        songCount: playlist.songCount,
                        totalLength: playlist.totalLength,
                    },
                });
            })
            .catch((error) => {
                if (error?.code === PrismaError.ENTITY_NOT_FOUND)
                    throw new NotFoundException("Song or playlist not found");
                else if (error?.code === PrismaError.UNIQUE_CONSTRAINT_FAILED)
                    throw new BadRequestException(
                        "Song already added to playlist.",
                    );

                throw new InternalServerErrorException();
            });

        return true;
    }

    async removeSongFromPlaylist(
        playlistId: string,
        songId: string,
    ): Promise<boolean> {
        const songInPlaylist = await this.prisma.playlistSong
            .findUniqueOrThrow({
                where: {
                    playlistId_songId: { playlistId, songId },
                },
                include: {
                    song: {
                        select: { length: true },
                    },
                },
            })
            .catch((error) => {
                if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                    throw new NotFoundException(
                        "Song was not found in playlist.",
                    );
                } else {
                    throw new InternalServerErrorException();
                }
            });

        const { song, order } = songInPlaylist;

        await this.prisma.$transaction([
            this.prisma.playlistSong.delete({
                where: {
                    playlistId_songId: { playlistId, songId },
                },
            }),
            this.prisma.playlistSong.updateMany({
                where: {
                    AND: {
                        playlistId,
                        order: { gt: order },
                    },
                },
                data: {
                    order: { decrement: 1 },
                },
            }),
            this.prisma.playlist.update({
                where: { id: playlistId },
                data: {
                    songCount: { decrement: 1 },
                    totalLength: { decrement: song.length },
                },
            }),
        ]);

        return true;
    }

    async moveSong(
        playlistId: string,
        songId: string,
        to: number,
    ): Promise<boolean> {
        if (!to || to < 1)
            throw new BadRequestException("Position is not valid.");

        const playlistSong = await this.prisma.playlistSong
            .findUniqueOrThrow({
                where: {
                    playlistId_songId: { playlistId, songId },
                },
                include: {
                    playlist: {
                        select: { songCount: true },
                    },
                },
            })
            .catch((error) => {
                if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                    throw new NotFoundException(
                        "Song was not found in playlist.",
                    );
                } else {
                    throw new InternalServerErrorException();
                }
            });

        const { playlist, order: currentPos } = playlistSong;
        if (to === currentPos) return;

        if (to > playlist.songCount)
            throw new BadRequestException("Position is not valid.");

        const whereQuery: Prisma.PlaylistSongWhereInput =
            currentPos > to
                ? {
                      AND: {
                          playlistId,
                          order: { gte: to, lt: currentPos },
                      },
                  }
                : {
                      AND: {
                          playlistId,
                          order: { gt: currentPos, lte: to },
                      },
                  };

        const updateQuery: Prisma.PlaylistSongUpdateInput =
            currentPos > to
                ? { order: { increment: 1 } }
                : { order: { decrement: 1 } };

        await this.prisma.$transaction([
            this.prisma.playlistSong.updateMany({
                where: whereQuery,
                data: updateQuery,
            }),
            this.prisma.playlistSong.update({
                where: {
                    playlistId_songId: { playlistId, songId },
                },
                data: { order: to },
            }),
        ]);

        return true;
    }
}
