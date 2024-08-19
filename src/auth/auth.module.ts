import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secretKey',
            signOptions: { expiresIn: '60m' }
        })
    ],
    providers: [],
    exports: [],
})
export class AuthModule { }
