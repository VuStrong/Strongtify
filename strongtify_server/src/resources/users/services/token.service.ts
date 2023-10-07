import { Injectable } from "@nestjs/common";
import { TokenService } from "../interfaces/token-service.interface";
import { Token, TokenType, User } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import {
    EMAIL_CONFIRMATION_TOKEN_LIFETIME,
    REFRESH_TOKEN_LIFETIME,
    RESET_PASSWORD_TOKEN_LIFETIME,
} from "src/auth/constants";
import { StringService } from "src/common/utils/string.service";

@Injectable()
export class TokenServiceImpl implements TokenService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly stringService: StringService,
    ) {}

    async getToken(user: User, token: string): Promise<Token> {
        return this.prisma.token.findUnique({
            where: {
                token_userId: {
                    token,
                    userId: user.id,
                },
            },
        });
    }

    async createRefreshTokenForUser(user: User): Promise<string> {
        const refreshToken = this.stringService.random(40);
        const date = new Date();
        date.setDate(date.getDate() + REFRESH_TOKEN_LIFETIME);

        await this.prisma.token.create({
            data: {
                token: refreshToken,
                expiryTime: date,
                type: TokenType.REFRESH_TOKEN,
                userId: user.id,
            },
        });

        return refreshToken;
    }

    async createEmailConfirmationToken(user: User): Promise<string> {
        // delete email confirm tokens created previous
        await this.prisma.token.deleteMany({
            where: {
                AND: {
                    userId: user.id,
                    type: TokenType.CONFIRM_EMAIL,
                },
            },
        });

        const date = new Date();
        date.setDate(date.getDate() + EMAIL_CONFIRMATION_TOKEN_LIFETIME);

        const token = await this.prisma.token.create({
            data: {
                user: {
                    connect: { id: user.id },
                },
                token: this.stringService.random(40),
                expiryTime: date,
                type: TokenType.CONFIRM_EMAIL,
            },
        });

        return token.token;
    }

    async createResetPasswordToken(user: User): Promise<string> {
        // delete reset password tokens created previous
        await this.prisma.token.deleteMany({
            where: {
                AND: {
                    userId: user.id,
                    type: TokenType.RESET_PASSWORD,
                },
            },
        });

        const date = new Date();
        date.setDate(date.getDate() + RESET_PASSWORD_TOKEN_LIFETIME);

        const token = await this.prisma.token.create({
            data: {
                user: {
                    connect: { id: user.id },
                },
                token: this.stringService.random(40),
                expiryTime: date,
                type: TokenType.RESET_PASSWORD,
            },
        });

        return token.token;
    }

    async revokeRefreshToken(userId: string, refreshToken: string) {
        await this.prisma.token.delete({
            where: {
                token_userId: {
                    token: refreshToken,
                    userId,
                },
            },
        });
    }
}
