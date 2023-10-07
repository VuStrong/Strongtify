import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";

export class BaseAuthService {
    constructor(protected readonly jwtService: JwtService) {}

    protected async createAccessToken(user: User) {
        return this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
            emailConfirmed: user.emailConfirmed,
            locked: user.locked,
        });
    }
}
