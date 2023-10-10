import { Module } from "@nestjs/common";
import { AuthServiceImpl } from "./services/auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { MailModule } from "src/mail/mail.module";
import { UsersModule } from "src/resources/users/users.module";
import { GoogleStrategy } from "./strategy/google.strategy";
import { FacebookStrategy } from "./strategy/facebook.strategy";
import { GithubStrategy } from "./strategy/github.strategy";
import { AUTH_SERVICES } from "./interfaces/constants";
import { SocialAuthServiceImpl } from "./services/social-auth.service";
import { ConfirmEmailServiceImpl } from "./services/confirm-email.service";
import { ResetPasswordServiceImpl } from "./services/reset-password.service";

const authService = {
    provide: AUTH_SERVICES.AuthService,
    useClass: AuthServiceImpl,
};

const socialAuthService = {
    provide: AUTH_SERVICES.SocialAuthService,
    useClass: SocialAuthServiceImpl,
};

const confirmEmailService = {
    provide: AUTH_SERVICES.ConfirmEmailService,
    useClass: ConfirmEmailServiceImpl,
};

const resetPasswordService = {
    provide: AUTH_SERVICES.ResetPasswordService,
    useClass: ResetPasswordServiceImpl,
};

@Module({
    imports: [
        UsersModule,
        MailModule,
        JwtModule.register({
            global: true,
            secret: `${process.env.JWT_SECRET}`,
            // signOptions: { expiresIn: "30m" },
            signOptions: { expiresIn: "30d" },
        }),
    ],
    providers: [
        GoogleStrategy,
        FacebookStrategy,
        GithubStrategy,
        authService,
        socialAuthService,
        confirmEmailService,
        resetPasswordService,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
