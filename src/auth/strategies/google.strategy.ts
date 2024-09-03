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
            const payload = { email: user.email, sub: user.id };
            const jwtToken = this.jwtService.sign(payload);
            done(null, {
                access_token: jwtToken,
                user: {
                    email: user.email,
                    name: user.name,
                    googleId: user.googleId,
                }
            });
        } catch (error) {
            done(error, false);
        }

    }

}