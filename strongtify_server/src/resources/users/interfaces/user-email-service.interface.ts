import { User } from "@prisma/client";

/**
 * Interface for User to manage email
 */
export interface UserEmailService {
    confirmEmail(user: User, token: string): Promise<boolean>;
}
