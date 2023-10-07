import { Inject, Injectable } from "@nestjs/common";
import { ConfirmEmailService } from "../interfaces/confirm-email-service.interface";
import { MailService } from "src/mail/mail.service";
import { ConfirmEmailDto } from "../dtos/email-confirm/confirm-email.dto";
import { USER_SERVICES } from "src/resources/users/interfaces/constants";
import { GetUserService } from "src/resources/users/interfaces/get-user-service.interface";
import { TokenService } from "src/resources/users/interfaces/token-service.interface";
import { UserEmailService } from "src/resources/users/interfaces/user-email-service.interface";

@Injectable()
export class ConfirmEmailServiceImpl implements ConfirmEmailService {
    constructor(
        @Inject(USER_SERVICES.GetUserService)
        protected readonly getUserService: GetUserService,
        @Inject(USER_SERVICES.TokenService)
        protected readonly tokenService: TokenService,
        @Inject(USER_SERVICES.UserEmailService)
        protected readonly userEmailService: UserEmailService,
        private readonly mailService: MailService,
    ) {}

    async confirmUserEmail(confirmEmailDto: ConfirmEmailDto): Promise<void> {
        const user = await this.getUserService.findById(confirmEmailDto.userId);

        if (user.emailConfirmed) return;

        await this.userEmailService.confirmEmail(user, confirmEmailDto.token);
    }

    async resendEmailConfirmationToken(userId: string): Promise<void> {
        const user = await this.getUserService.findById(userId);

        if (user.emailConfirmed) return;

        const token = await this.tokenService.createEmailConfirmationToken(
            user,
        );

        this.mailService.sendEmail({
            to: user.email,
            subject: "Confirm account",
            templateName: "confirm-email",
            templateVars: {
                name: user.name,
                confirmationUrl: `${process.env.CLIENT_EMAIL_CONFIRM_URL}?token=${token}&userId=${user.id}`,
            },
        });
    }
}
