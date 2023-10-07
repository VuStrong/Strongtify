import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { RegisterDto } from "../dtos/register.dto";
import { SignInDto } from "../dtos/sign-in.dto";
import { SignInResponseDto } from "../dtos/signin-response.dto";

/**
 * Interface for auth actions
 */
export interface AuthService {
    register(registerDto: RegisterDto): Promise<SignInResponseDto>;

    signIn(signInDto: SignInDto): Promise<SignInResponseDto>;

    signOut(userId: string, refreshToken: string): Promise<void>;

    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<SignInResponseDto>;
}
