import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-github2";
import { Injectable } from "@nestjs/common";
import { SocialLoginDto } from "../dtos/social-login.dto";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
    constructor() {
        super({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "https://api.strongtify.io.vn/v1/auth/github-redirect",
            scope: ["user:email"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void,
    ): Promise<any> {
        const { username, emails, photos } = profile;
        const user: SocialLoginDto = {
            name: username,
            email: emails && emails[0].value,
            photo: photos && photos[0].value,
        };

        done(null, user);
    }
}
