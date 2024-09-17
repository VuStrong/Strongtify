import {
    Body,
    Controller,
    Get,
    HttpCode,
    Inject,
    Post,
    Res,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiExcludeEndpoint,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import { AnonymousEmail } from "src/auth/decorators/anonymous-email.decorator";
import { User } from "src/resources/users/decorators/user.decorator";
import { AuthGuard } from "./guards/auth.guard";
import { ACCESS_TOKEN } from "src/auth/constants";

import { SignInResponseDto } from "./dtos/signin-response.dto";
import { TransformDataInterceptor } from "src/common/interceptors/transform-data.interceptor";
import { ConfirmEmailDto } from "./dtos/email-confirm/confirm-email.dto";
import { ResetPasswordDto } from "./dtos/password-reset/reset-password.dto";
import { SendPasswordResetDto } from "./dtos/password-reset/send-password-reset.dto";
import { SignInDto } from "./dtos/sign-in.dto";
import { RegisterDto } from "./dtos/register.dto";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";
import { LogoutDto } from "./dtos/logout.dto";

import { GoogleOAuthGuard } from "./guards/google-oauth.guard";
import { FacebookOAuthGuard } from "./guards/facebook-oauth.guard";
import { GithubOAuthGuard } from "./guards/github-oauth.guard";
import { AUTH_SERVICES } from "./interfaces/constants";
import { AuthService } from "./interfaces/auth-service.interface";
import { SocialAuthService } from "./interfaces/social-auth-service.interface";
import { ConfirmEmailService } from "./interfaces/confirm-email-service.interface";
import { ResetPasswordService } from "./interfaces/reset-password-service.interface";

@ApiTags("auth")
@Controller({
    path: "auth",
    version: "1",
})
export class AuthController {
    constructor(
        @Inject(AUTH_SERVICES.AuthService)
        private readonly authService: AuthService,
        @Inject(AUTH_SERVICES.SocialAuthService)
        private readonly socialAuthService: SocialAuthService,
        @Inject(AUTH_SERVICES.ConfirmEmailService)
        private readonly confirmEmailService: ConfirmEmailService,
        @Inject(AUTH_SERVICES.ResetPasswordService)
        private readonly resetPasswordService: ResetPasswordService,
    ) {}

    @ApiOperation({ summary: "Register new user" })
    @ApiBadRequestResponse({ description: "Email already exist." })
    @ApiCreatedResponse({ type: SignInResponseDto })
    @Post("register")
    @UseInterceptors(new TransformDataInterceptor(SignInResponseDto))
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @ApiOperation({ summary: "Login" })
    @ApiBadRequestResponse({ description: "Email or password is incorrect" })
    @ApiForbiddenResponse({ description: "You are locked out" })
    @ApiOkResponse({ type: SignInResponseDto })
    @HttpCode(200)
    @Post("login")
    @UseInterceptors(new TransformDataInterceptor(SignInResponseDto))
    async login(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto);
    }

    @ApiOperation({ summary: "Logout" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @ApiOkResponse()
    @ApiBadRequestResponse({ description: "Refresh token invalid" })
    @HttpCode(200)
    @Post("logout")
    @UseGuards(AuthGuard)
    @AnonymousEmail()
    async logout(@User("sub") userId: string, @Body() logoutDto: LogoutDto) {
        await this.authService.signOut(userId, logoutDto.refreshToken);

        return { success: true };
    }

    @ApiOperation({ summary: "Refresh new access token" })
    @ApiOkResponse({ type: SignInResponseDto })
    @ApiBadRequestResponse({ description: "Invalid refresh token" })
    @ApiForbiddenResponse({ description: "You are locked out" })
    @HttpCode(200)
    @Post("refresh-token")
    @UseInterceptors(new TransformDataInterceptor(SignInResponseDto))
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto);
    }

    @ApiOperation({ summary: "Confirm user's email" })
    @ApiOkResponse()
    @ApiNotFoundResponse({ description: "User not found" })
    @ApiBadRequestResponse({ description: "Invalid confirm email token." })
    @HttpCode(200)
    @Post("confirm-email")
    async confirm(@Body() confirmEmailDto: ConfirmEmailDto) {
        await this.confirmEmailService.confirmUserEmail(confirmEmailDto);

        return { success: true };
    }

    @ApiOperation({ summary: "Resend confirm email link" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @ApiOkResponse()
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @AnonymousEmail()
    @Post("confirm-email-link")
    async resendEmailConfirmation(@User("sub") userId: string) {
        await this.confirmEmailService.resendEmailConfirmationToken(userId);

        return { success: true };
    }

    @ApiOperation({ summary: "Reset user's password" })
    @ApiOkResponse()
    @ApiBadRequestResponse({ description: "Invalid password reset token." })
    @ApiNotFoundResponse({ description: "User not found" })
    @HttpCode(200)
    @Post("reset-password")
    async reset(@Body() resetPasswordDto: ResetPasswordDto) {
        await this.resetPasswordService.resetPassword(resetPasswordDto);

        return { success: true };
    }

    @ApiOperation({ summary: "Send password reset link" })
    @ApiOkResponse()
    @ApiNotFoundResponse({ description: "User not found" })
    @HttpCode(200)
    @Post("reset-password-link")
    async sendResetLink(@Body() data: SendPasswordResetDto) {
        await this.resetPasswordService.sendResetPasswordToken(data.email);

        return { success: true };
    }

    @ApiExcludeEndpoint()
    @UseGuards(GoogleOAuthGuard)
    @Get("google")
    async googleAuth() {
        return;
    }

    @ApiExcludeEndpoint()
    @UseGuards(GoogleOAuthGuard)
    @Get("google-redirect")
    @UseInterceptors(new TransformDataInterceptor(SignInResponseDto))
    async googleAuthRedirect(@User() user, @Res() res) {
        const result = await this.socialAuthService.socialLogin(user);
        const jsonString = JSON.stringify(result).replace(/'/g, "\\'").replace(/"/g, '\\"');

        res.send(
            `<script>
                window.opener?.postMessage('${jsonString}', '*');

                try {
                    Print.postMessage('${jsonString}');
                } catch {}

                window.close();
            </script>`,
        );
        return result;
    }

    @ApiExcludeEndpoint()
    @UseGuards(FacebookOAuthGuard)
    @Get("facebook")
    async facebookAuth() {
        return;
    }

    @ApiExcludeEndpoint()
    @UseGuards(FacebookOAuthGuard)
    @Get("facebook-redirect")
    @UseInterceptors(new TransformDataInterceptor(SignInResponseDto))
    async facebookAuthRedirect(@User() user, @Res() res) {
        const result = await this.socialAuthService.socialLogin(user);
        const jsonString = JSON.stringify(result).replace(/'/g, "\\'").replace(/"/g, '\\"');

        res.send(
            `<script>window.opener.postMessage('${jsonString}', '*');window.close()</script>`,
        );
        return result;
    }

    @ApiExcludeEndpoint()
    @UseGuards(GithubOAuthGuard)
    @Get("github")
    async githubAuth() {
        return;
    }

    @ApiExcludeEndpoint()
    @UseGuards(GithubOAuthGuard)
    @Get("github-redirect")
    @UseInterceptors(new TransformDataInterceptor(SignInResponseDto))
    async githubAuthRedirect(@User() user, @Res() res) {
        const result = await this.socialAuthService.socialLogin(user);
        const jsonString = JSON.stringify(result).replace(/'/g, "\\'").replace(/"/g, '\\"');

        res.send(
            `<script>window.opener.postMessage('${jsonString}', '*');window.close()</script>`,
        );
        return result;
    }
}
