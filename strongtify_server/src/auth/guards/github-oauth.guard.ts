import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GithubOAuthGuard extends AuthGuard("github") {
    constructor(private configService: ConfigService) {
        super();
    }
}
