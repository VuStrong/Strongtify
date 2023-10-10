import {
    BadRequestException,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Prisma, TokenType, User } from "@prisma/client";

import { SignInDto } from "../dtos/sign-in.dto";
import { RegisterDto } from "../dtos/register.dto";
import { SignInResponseDto } from "../dtos/signin-response.dto";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { MailService } from "src/mail/mail.service";
import { PrismaError } from "src/database/enums/prisma-error.enum";
import { AuthService } from "../interfaces/auth-service.interface";
import { BaseAuthService } from "./base-auth.service";
import { USER_SERVICES } from "src/resources/users/interfaces/constants";
import { GetUserService } from "src/resources/users/interfaces/get-user-service.interface";
import { CudUserService } from "src/resources/users/interfaces/cud-user-service.interface";
import { TokenService } from "src/resources/users/interfaces/token-service.interface";

@Injectable()
export class AuthServiceImpl extends BaseAuthService implements AuthService {
    constructor(
        protected readonly jwtService: JwtService,
        private readonly mailService: MailService,
        @Inject(USER_SERVICES.GetUserService)
        protected readonly getUserService: GetUserService,
        @Inject(USER_SERVICES.CudUserService)
        protected readonly cudUserService: CudUserService,
        @Inject(USER_SERVICES.TokenService)
        protected readonly tokenService: TokenService,
    ) {
        super(jwtService);
    }

    async register(registerDto: RegisterDto): Promise<SignInResponseDto> {
        const { name, email, password } = registerDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const newUser = await this.cudUserService.create({
                name,
                email,
                hashedPassword,
            });

            const refreshToken =
                await this.tokenService.createRefreshTokenForUser(newUser);

            const token = await this.tokenService.createEmailConfirmationToken(
                newUser,
            );

            this.mailService.sendEmail({
                to: newUser.email,
                subject: "Confirm account",
                templateName: "confirm-email",
                templateVars: {
                    name: newUser.name,
                    confirmationUrl: `${process.env.CLIENT_EMAIL_CONFIRM_URL}?token=${token}&userId=${newUser.id}`,
                },
            });

            return {
                access_token: await this.createAccessToken(newUser),
                refresh_token: refreshToken,
                user: newUser,
            };
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error?.code === PrismaError.UNIQUE_CONSTRAINT_FAILED
            ) {
                throw new BadRequestException(`Email ${email} đã tồn tại`);
            }

            throw new HttpException(
                "Có lỗi nào đó xảy ra.",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
        const { email, password } = signInDto;
        const user: User = await this.getUserService
            .findByEmail(email)
            .catch(() => null);

        if (!user || !user.hashedPassword) {
            throw new BadRequestException(
                "Email hoặc mật khẩu không chính xác",
            );
        }

        const isMatch = await bcrypt.compare(password, user.hashedPassword);

        if (!isMatch) {
            throw new BadRequestException(
                "Email hoặc mật khẩu không chính xác",
            );
        }

        if (user.locked) {
            throw new ForbiddenException("Tài khoản đang bị khóa");
        }

        const refreshToken = await this.tokenService.createRefreshTokenForUser(
            user,
        );

        return {
            access_token: await this.createAccessToken(user),
            refresh_token: refreshToken,
            user,
        };
    }

    async signOut(userId: string, refreshToken: string): Promise<void> {
        await this.tokenService
            .revokeRefreshToken(userId, refreshToken)
            .catch((error) => {
                if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                    throw new BadRequestException("Refresh token invalid.");
                } else {
                    throw new InternalServerErrorException();
                }
            });
    }

    async refreshToken(
        refreshTokenDto: RefreshTokenDto,
    ): Promise<SignInResponseDto> {
        const { userId, refreshToken } = refreshTokenDto;
        const user: User = await this.getUserService
            .findById(userId)
            .catch(() => null);

        if (!user) {
            throw new BadRequestException("Invalid userId or refresh token!");
        }

        if (user.locked) {
            throw new ForbiddenException("You are locked out.");
        }

        const token = await this.tokenService.getToken(user, refreshToken);

        if (!token || token.type !== TokenType.REFRESH_TOKEN) {
            throw new BadRequestException("Invalid userId or refresh token!");
        }

        if (token.expiryTime < new Date()) {
            await this.signOut(userId, refreshToken);
            throw new BadRequestException("Invalid userId or refresh token!");
        }

        return {
            access_token: await this.createAccessToken(user),
            refresh_token: refreshToken,
        };
    }
}
