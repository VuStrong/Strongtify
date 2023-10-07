import { ConfirmEmailDto } from "../dtos/email-confirm/confirm-email.dto";

/**
 * Interface for confirm email
 */
export interface ConfirmEmailService {
    confirmUserEmail(confirmEmailDto: ConfirmEmailDto): Promise<void>;

    resendEmailConfirmationToken(userId: string): Promise<void>;
}
