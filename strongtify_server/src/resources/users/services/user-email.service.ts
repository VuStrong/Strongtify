import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { UserEmailService } from "../interfaces/user-email-service.interface";
import { PrismaService } from "src/database/prisma.service";
import { TokenService } from "../interfaces/token-service.interface";
import { USER_SERVICES } from "../interfaces/constants";
import { TokenType, User } from "@prisma/client";

@Injectable()
export class UserEmailServiceImpl implements UserEmailService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(USER_SERVICES.TokenService)
        private readonly tokenService: TokenService,
    ) {}

    async confirmEmail(user: User, token: string): Promise<boolean> {
        const tokenInDb = await this.tokenService.getToken(user, token);

        if (
            !tokenInDb ||
            tokenInDb.type !== TokenType.CONFIRM_EMAIL ||
            tokenInDb.expiryTime < new Date()
        ) {
            throw new BadRequestException("Invalid confirm email token.");
        }

        await this.prisma.user.update({
            data: {
                emailConfirmed: true,
            },
            where: { id: user.id },
        });

        await this.prisma.token.delete({
            where: { id: tokenInDb.id },
        });

        return true;
    }
}
