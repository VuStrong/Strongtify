import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ANONYMOUS_EMAIL_KEY } from "src/auth/decorators/anonymous-email.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!request.user)
            throw new UnauthorizedException("Invalid access token.");

        if (request.user.locked) {
            throw new ForbiddenException("You are locked out.");
        }

        const isAnonymousEmail = this.reflector.getAllAndOverride<boolean>(
            ANONYMOUS_EMAIL_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!isAnonymousEmail && !request.user.emailConfirmed) {
            throw new ForbiddenException("Email must be confirmed.");
        }

        return true;
    }
}
