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
import { PlaylistNotFoundException } from "../exceptions/playlist-not-found.exception";

@Injectable()
export class ManagePlaylistSongsServiceImpl
    implements ManagePlaylistSongsService
{
    constructor(private readonly prisma: PrismaService) {}

    async addSongsToPlaylist(
        playlistId: string,
        songIds: string[],
    ): Promise<void> {
        if (!songIds || songIds.length === 0) return;

        await this.prisma.playlistSong.createMany({
            data: songIds.map(songId => ({
                playlistId,
                songId,
                order: 0
            }))
        }).catch((error) => {
            if (error?.code === PrismaError.FOREIGN_KEY_CONSTRAINT_FAILED)
                throw new NotFoundException("Song or playlist not found");
            else if (error?.code === PrismaError.UNIQUE_CONSTRAINT_FAILED)
                throw new BadRequestException(
                    "Song already added to playlist.",
                );

            throw new InternalServerErrorException();
        });

        //Get songIds of playlist, append new ids and change order
        const songIdsInDb = (await this.prisma.playlistSong.findMany({
            where: {
                playlistId,
                songId: {
                    notIn: songIds
                }
            },
            orderBy: { order: "asc" },
            select: { songId: true }
        })).map(s => s.songId);

        const newOrderedIds = songIdsInDb.concat(songIds);

        await this.changeSongsOrder(playlistId, newOrderedIds);
    }

    async removeSongFromPlaylist(
        playlistId: string,
        songId: string,
    ): Promise<void> {
        await this.prisma.playlistSong.delete({
            where: {
                playlistId_songId: { playlistId, songId },
            },
        }).catch((error) => {
            if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                throw new NotFoundException(
                    "Song was not found in playlist.",
                );
            } else {
                throw new InternalServerErrorException();
            }
        });
    }

    async changeSongsOrder(
        playlistId: string,
        songIds: string[],
    ): Promise<void> {
        if (!songIds[0]) return;

        const playlist = await this.prisma.playlist.findUnique({
            where: { id: playlistId },
            select: { id: true }
        });

        if (!playlist) throw new PlaylistNotFoundException();

        await this.prisma.$executeRaw`
            UPDATE _PlaylistToSong SET _PlaylistToSong.order = field(songId, ${Prisma.join(songIds)}) 
            WHERE playlistId = ${playlistId} AND songId IN (${Prisma.join(songIds)});
        `;
    }
}
