import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secretKey',
            signOptions: { expiresIn: '60m' }
        })
    ],
    providers: [AuthService],
    exports: [],
})
export class AuthModule { }
