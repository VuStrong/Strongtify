import {
    BadRequestException,
    Injectable,
    NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { PrismaService } from "src/database/prisma.service";
import { PlaylistNotFoundException } from "../exceptions/playlist-not-found.exception";

@Injectable()
export class GetPlaylistByIdMiddleware implements NestMiddleware {
    constructor(private readonly prisma: PrismaService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        if (!req.params.id) throw new BadRequestException("Missing id");

        const playlist = await this.prisma.playlist.findUnique({
            where: { id: req.params.id },
            select: {
                userId: true,
                status: true,
            },
        });

        if (!playlist) throw new PlaylistNotFoundException();

        req["playlist"] = playlist;
        next();
    }
}
