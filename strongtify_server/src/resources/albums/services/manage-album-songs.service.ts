import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaError } from "src/database/enums/prisma-error.enum";
import { PrismaService } from "src/database/prisma.service";
import { ManageAlbumSongsService } from "../interfaces/manage-album-songs-service.interface";

@Injectable()
export class ManageAlbumSongsServiceImpl implements ManageAlbumSongsService {
    constructor(private readonly prisma: PrismaService) {}

    async addSongsToAlbum(
        albumId: string,
        songIds: string[],
    ): Promise<boolean> {
        if (!songIds || songIds.length === 0) return;

        await this.prisma
            .$transaction(async (tx) => {
                const album = await tx.album.findUniqueOrThrow({
                    where: { id: albumId },
                    select: { songCount: true, totalLength: true },
                });
                const albumSongsToAdd: Prisma.Enumerable<Prisma.AlbumSongCreateManyInput> =
                    [];

                for (const songId of songIds) {
                    const song = await tx.song.findUniqueOrThrow({
                        where: { id: songId },
                        select: { length: true },
                    });

                    album.songCount += 1;
                    album.totalLength += song.length;

                    albumSongsToAdd.push({
                        albumId,
                        songId,
                        order: album.songCount,
                    });
                }

                await tx.albumSong.createMany({
                    data: albumSongsToAdd,
                });

                await tx.album.update({
                    where: { id: albumId },
                    data: {
                        songCount: album.songCount,
                        totalLength: album.totalLength,
                    },
                });
            })
            .catch((error) => {
                if (error?.code === PrismaError.ENTITY_NOT_FOUND)
                    throw new NotFoundException("Song or album not found");
                else if (error?.code === PrismaError.UNIQUE_CONSTRAINT_FAILED)
                    throw new BadRequestException(
                        "Song already added to album.",
                    );

                throw new InternalServerErrorException();
            });

        return true;
    }

    async removeSongFromAlbum(
        albumId: string,
        songId: string,
    ): Promise<boolean> {
        const songInAlbum = await this.prisma.albumSong
            .findUniqueOrThrow({
                where: {
                    albumId_songId: { albumId, songId },
                },
                include: {
                    song: {
                        select: { length: true },
                    },
                },
            })
            .catch((error) => {
                if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                    throw new NotFoundException("Song was not found in album.");
                } else {
                    throw new InternalServerErrorException();
                }
            });

        const { song, order } = songInAlbum;

        await this.prisma.$transaction([
            this.prisma.albumSong.delete({
                where: {
                    albumId_songId: { albumId, songId },
                },
            }),
            this.prisma.albumSong.updateMany({
                where: {
                    AND: {
                        albumId,
                        order: { gt: order },
                    },
                },
                data: {
                    order: { decrement: 1 },
                },
            }),
            this.prisma.album.update({
                where: { id: albumId },
                data: {
                    songCount: { decrement: 1 },
                    totalLength: { decrement: song.length },
                },
            }),
        ]);

        return true;
    }

    /**
     * move a song in album to another position
     */
    async moveSong(
        albumId: string,
        songId: string,
        to: number,
    ): Promise<boolean> {
        if (!to || to < 1)
            throw new BadRequestException("Position is not valid.");

        const albumSong = await this.prisma.albumSong
            .findUniqueOrThrow({
                where: {
                    albumId_songId: { albumId, songId },
                },
                include: {
                    album: {
                        select: { songCount: true },
                    },
                },
            })
            .catch((error) => {
                if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                    throw new NotFoundException("Song was not found in album.");
                } else {
                    throw new InternalServerErrorException();
                }
            });

        const { album, order: currentPos } = albumSong;
        if (to === currentPos) return;

        if (to > album.songCount)
            throw new BadRequestException("Position is not valid.");

        const whereQuery: Prisma.AlbumSongWhereInput =
            currentPos > to
                ? {
                      AND: {
                          albumId,
                          order: { gte: to, lt: currentPos },
                      },
                  }
                : {
                      AND: {
                          albumId,
                          order: { gt: currentPos, lte: to },
                      },
                  };

        const updateQuery: Prisma.AlbumSongUpdateInput =
            currentPos > to
                ? { order: { increment: 1 } }
                : { order: { decrement: 1 } };

        await this.prisma.$transaction([
            this.prisma.albumSong.updateMany({
                where: whereQuery,
                data: updateQuery,
            }),
            this.prisma.albumSong.update({
                where: {
                    albumId_songId: { albumId, songId },
                },
                data: { order: to },
            }),
        ]);

        return true;
    }
}
