import { Inject, Injectable } from "@nestjs/common";
import { ResetPasswordService } from "../interfaces/reset-password-service.interface";
import { MailService } from "src/mail/mail.service";
import { ResetPasswordDto } from "../dtos/password-reset/reset-password.dto";
import { USER_SERVICES } from "src/resources/users/interfaces/constants";
import { GetUserService } from "src/resources/users/interfaces/get-user-service.interface";
import { TokenService } from "src/resources/users/interfaces/token-service.interface";
import { PasswordService } from "src/resources/users/interfaces/password-service.interface";

@Injectable()
export class ResetPasswordServiceImpl implements ResetPasswordService {
    constructor(
        @Inject(USER_SERVICES.GetUserService)
        protected readonly getUserService: GetUserService,
        @Inject(USER_SERVICES.TokenService)
        protected readonly tokenService: TokenService,
        @Inject(USER_SERVICES.PasswordService)
        protected readonly passwordService: PasswordService,
        private readonly mailService: MailService,
    ) {}

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
        const user = await this.getUserService.findById(
            resetPasswordDto.userId,
        );

        await this.passwordService.resetPassword(
            user,
            resetPasswordDto.token,
            resetPasswordDto.newPassword,
        );
    }

    async sendResetPasswordToken(email: string): Promise<void> {
        const user = await this.getUserService.findByEmail(email);

        const token = await this.tokenService.createResetPasswordToken(user);

        this.mailService.sendEmail({
            to: user.email,
            subject: "Reset password",
            templateName: "reset-password",
            templateVars: {
                name: user.name,
                resetPasswordUrl: `${process.env.CLIENT_RESET_PASSWORD_URL}?token=${token}&userId=${user.id}`,
            },
        });
    }
}
