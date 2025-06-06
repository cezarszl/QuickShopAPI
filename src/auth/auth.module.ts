import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserService } from 'src/users/user.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secretKey',
            signOptions: { expiresIn: '15m' }
        }),
    ],
    providers: [AuthService, UserService, PrismaService, JwtStrategy, GoogleStrategy],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule { }
