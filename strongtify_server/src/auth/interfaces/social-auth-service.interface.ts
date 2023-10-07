import { SignInResponseDto } from "../dtos/signin-response.dto";
import { SocialLoginDto } from "../dtos/social-login.dto";

/**
 * Interface for social auth services
 */
export interface SocialAuthService {
    socialLogin(socialLoginDto: SocialLoginDto): Promise<SignInResponseDto>;
}
