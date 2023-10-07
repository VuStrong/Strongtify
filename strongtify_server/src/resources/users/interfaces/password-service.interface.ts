import { User } from "@prisma/client";
import { ChangePasswordDto } from "../dtos/change-password.dto";

/**
 * Interface for user to manage password
 */
export interface PasswordService {
    changePassword(
        user: User,
        changePasswordDto: ChangePasswordDto,
    ): Promise<boolean>;

    resetPassword(
        user: User,
        token: string,
        newPassword: string,
    ): Promise<boolean>;
}
