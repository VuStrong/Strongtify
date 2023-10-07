import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { PasswordService } from "../interfaces/password-service.interface";
import { PrismaService } from "src/database/prisma.service";
import { ChangePasswordDto } from "../dtos/change-password.dto";
import * as bcrypt from "bcrypt";
import { TokenType, User } from "@prisma/client";
import { USER_SERVICES } from "../interfaces/constants";
import { TokenService } from "../interfaces/token-service.interface";

@Injectable()
export class PasswordServiceImpl implements PasswordService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(USER_SERVICES.TokenService)
        private readonly tokenService: TokenService,
    ) {}

    async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
        const { oldPassword, newPassword } = changePasswordDto;
        if (!(await bcrypt.compare(oldPassword, user.hashedPassword))) {
            throw new BadRequestException("Password does not match!");
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                hashedPassword: newHashedPassword,
            },
        });

        return true;
    }

    async resetPassword(user: User, token: string, newPassword: string) {
        const tokenInDb = await this.tokenService.getToken(user, token);

        if (
            !tokenInDb ||
            tokenInDb.type !== TokenType.RESET_PASSWORD ||
            tokenInDb.expiryTime < new Date()
        ) {
            throw new BadRequestException("Invalid password reset token.");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            data: {
                hashedPassword,
            },
            where: { id: user.id },
        });

        await this.prisma.token.delete({
            where: { id: tokenInDb.id },
        });

        return true;
    }
}
