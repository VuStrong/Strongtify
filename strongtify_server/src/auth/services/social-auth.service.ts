import { Inject, Injectable } from "@nestjs/common";
import { SocialAuthService } from "../interfaces/social-auth-service.interface";
import { SocialLoginDto } from "../dtos/social-login.dto";
import { SignInResponseDto } from "../dtos/signin-response.dto";
import { User } from "@prisma/client";
import { BaseAuthService } from "./base-auth.service";
import { JwtService } from "@nestjs/jwt";
import { USER_SERVICES } from "src/resources/users/interfaces/constants";
import { GetUserService } from "src/resources/users/interfaces/get-user-service.interface";
import { CudUserService } from "src/resources/users/interfaces/cud-user-service.interface";
import { TokenService } from "src/resources/users/interfaces/token-service.interface";

@Injectable()
export class SocialAuthServiceImpl
    extends BaseAuthService
    implements SocialAuthService
{
    constructor(
        @Inject(USER_SERVICES.GetUserService)
        protected readonly getUserService: GetUserService,
        @Inject(USER_SERVICES.CudUserService)
        protected readonly cudUserService: CudUserService,
        @Inject(USER_SERVICES.TokenService)
        protected readonly tokenService: TokenService,
        protected readonly jwtService: JwtService,
    ) {
        super(jwtService);
    }

    async socialLogin(
        socialLoginDto: SocialLoginDto,
    ): Promise<SignInResponseDto> {
        const { name, email, photo } = socialLoginDto;
        let user: User | undefined = await this.getUserService
            .findByEmail(email)
            .catch(() => undefined);

        // if user not exist in database, auto add new user
        if (!user) {
            user = await this.cudUserService.create({
                name,
                email,
                emailConfirmed: true,
                imageUrl: photo,
            });
        }
        // if user's email not confirmed, then auto confirm email
        else if (!user.emailConfirmed) {
            user = await this.cudUserService.update({
                where: { id: user.id },
                data: { emailConfirmed: true },
            });
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
}
