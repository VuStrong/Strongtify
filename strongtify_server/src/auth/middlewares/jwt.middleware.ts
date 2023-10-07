import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";

/**
 * decode data in jwt token and assign it to request.user
 */
@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const token = this.getTokenFromHeader(req);

        if (token) {
            const payload = await this.jwtService
                .verifyAsync(token, {
                    secret: process.env.JWT_SECRET,
                })
                .catch(() => undefined);

            req["user"] = payload;
        }

        next();
    }

    private getTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
