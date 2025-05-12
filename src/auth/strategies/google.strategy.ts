import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { User } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
@Injectable()

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
    ) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
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

            const tokens = await this.authService['generateTokens'](user);

            done(null, {
                access_token: tokens.accessToken,
                refresh_token: tokens.refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    createdAt: user.createdAt,
                    googleId: user.googleId,
                },
            });
        } catch (error) {
            done(error, false);
        }
    }
}