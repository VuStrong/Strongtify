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
import { AlbumNotFoundException } from "../exceptions/album-not-found.exception";

@Injectable()
export class ManageAlbumSongsServiceImpl implements ManageAlbumSongsService {
    constructor(private readonly prisma: PrismaService) {}

    async addSongsToAlbum(
        albumId: string,
        songIds: string[],
    ): Promise<void> {
        if (!songIds || songIds.length === 0) return;

        await this.prisma.albumSong.createMany({
            data: songIds.map(songId => ({
                albumId,
                songId,
                order: 0
            }))
        }).catch((error) => {
            if (error?.code === PrismaError.FOREIGN_KEY_CONSTRAINT_FAILED)
                throw new NotFoundException("Song or album not found");
            else if (error?.code === PrismaError.UNIQUE_CONSTRAINT_FAILED)
                throw new BadRequestException(
                    "Song already added to album.",
                );

            throw new InternalServerErrorException();
        });

        //Get songIds of album, append new ids and change order
        const songIdsInDb = (await this.prisma.albumSong.findMany({
            where: {
                albumId,
                songId: {
                    notIn: songIds
                }
            },
            orderBy: { order: "asc" },
            select: { songId: true }
        })).map(s => s.songId);

        const newOrderedIds = songIdsInDb.concat(songIds);

        await this.changeSongsOrder(albumId, newOrderedIds);
    }

    async removeSongFromAlbum(
        albumId: string,
        songId: string,
    ): Promise<void> {
        await this.prisma.albumSong.delete({
            where: {
                albumId_songId: { albumId, songId },
            },
        }).catch((error) => {
            if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                throw new NotFoundException("Song was not found in album.");
            } else {
                throw new InternalServerErrorException();
            }
        });
    }

    async changeSongsOrder(
        albumId: string,
        songIds: string[],
    ): Promise<void> {
        if (!songIds[0]) return;

        const album = await this.prisma.album.findUnique({
            where: { id: albumId },
            select: { id: true }
        });

        if (!album) throw new AlbumNotFoundException();

        await this.prisma.$executeRaw`
            UPDATE _AlbumToSong SET _AlbumToSong.order = field(songId, ${Prisma.join(songIds)}) 
            WHERE albumId = ${albumId} AND songId IN (${Prisma.join(songIds)});
        `;
    }
}
