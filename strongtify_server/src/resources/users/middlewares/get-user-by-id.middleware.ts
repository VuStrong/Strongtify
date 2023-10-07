import {
    BadRequestException,
    Injectable,
    NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { PrismaService } from "src/database/prisma.service";
import { UserNotFoundException } from "../exceptions/user-not-found.exception";

@Injectable()
export class GetUserByIdMiddleware implements NestMiddleware {
    constructor(private readonly prisma: PrismaService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        if (!req.params.id) throw new BadRequestException("Missing id");

        const user = await this.prisma.user.findUnique({
            where: { id: req.params.id },
            select: {
                role: true,
            },
        });

        if (!user) throw new UserNotFoundException();

        req["userInParam"] = user;
        next();
    }
}
