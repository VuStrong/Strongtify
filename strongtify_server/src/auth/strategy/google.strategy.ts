import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { SocialLoginDto } from "../dtos/social-login.dto";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://api.strongtify.io.vn/v1/auth/google-redirect",
            scope: ["email", "profile"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
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
