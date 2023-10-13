import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";
import { Injectable } from "@nestjs/common";
import { SocialLoginDto } from "../dtos/social-login.dto";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
    constructor() {
        super({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL:
                "https://api.strongtify.io.vn/v1/auth/facebook-redirect",
            profileFields: ["id", "displayName", "emails", "photos"],
            scope: ["email"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void,
    ): Promise<any> {
        const { displayName, emails, photos } = profile;
        const user: SocialLoginDto = {
            name: displayName,
            email: emails && emails[0].value,
            photo: photos && photos[0].value,
        };

        done(null, user);
    }
}
