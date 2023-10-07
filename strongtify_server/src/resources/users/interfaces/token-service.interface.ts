import { Token, User } from "@prisma/client";

/**
 * Interface for User to manage token
 */
export interface TokenService {
    getToken(user: User, token: string): Promise<Token>;

    createRefreshTokenForUser(user: User): Promise<string>;

    createEmailConfirmationToken(user: User): Promise<string>;

    createResetPasswordToken(user: User): Promise<string>;

    revokeRefreshToken(userId: string, refreshToken: string): Promise<void>;
}
