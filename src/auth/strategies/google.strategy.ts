import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { User } from "@prisma/client";

@Injectable()

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { emails, displayName } = profile;
        const email = emails[0].value;
        const googleId = profile.id;
        const name = displayName;

        try {
            const user: User = await this.authService.validateGoogleUser({ email, googleId, name });
            done(null, user);
        } catch (error) {
            done(error, false);
        }

    }

}