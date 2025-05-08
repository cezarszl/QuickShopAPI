import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { RegisterResponseDto } from './dto/register.response.dto';
import { LoginDtoResponse } from './dto/login.response.dto';
import { PrismaService } from 'prisma/prisma.service';



@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,

    ) { }

    async generateTokens(user: User) {
        const accessToken = this.jwtService.sign(
            { email: user.email, sub: user.id },
            { expiresIn: '15m' }
        );
        const refreshToken = this.jwtService.sign(
            { sub: user.id },
            { expiresIn: '7d' }
        );

        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
            },
        })

        return { accessToken, refreshToken };
    }

    async registerUser(registerDto: RegisterDto): Promise<RegisterResponseDto> {
        const { email, password, name, googleId } = registerDto;

        const existingUser = await this.userService.findUserByEmail(email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        const newUser = await this.userService.createUser({
            email,
            password: hashedPassword,
            name,
            googleId,
        });

        const tokens = await this.generateTokens(newUser);
        return {
            ...tokens,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                googleId: newUser.googleId,
            },
        };
    }

    async validateGoogleUser({ email, name, googleId }: { email: string, name: string, googleId: string }): Promise<User> {
        let user = await this.userService.findUserByEmail(email);

        if (user) {
            if (!user.googleId) {
                user = await this.userService.updateUserGoogleID(user.id, googleId);
            }
        } else {
            user = await this.userService.createUser({
                email,
                name,
                googleId,
            });
        }
        return user;
    }

    async login(loginDto: LoginDto): Promise<LoginDtoResponse> {
        const { email, password } = loginDto;

        //Finding use by email
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        // Comparing passwords
        if (!user.password || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.generateTokens(user);


        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                googleId: user.googleId
            }
        };
    }

    async refreshToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);
            const storedToken = await this.prisma.refreshToken.findUnique({
                where: { token },
                include: { user: true }
            });

            if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            // Unieważnij stary token
            await this.prisma.refreshToken.update({
                where: { id: storedToken.id },
                data: { revoked: true }
            });

            return this.generateTokens(storedToken.user);
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async revokeRefreshToken(token: string) {
        try {
            await this.prisma.refreshToken.update({
                where: { token },
                data: { revoked: true }
            });
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
    // Not in use for now
    // async validateToken(token: string): Promise<User> {
    //     try {
    //         const decoded = this.jwtService.verify(token);
    //         return await this.userService.findUserById(decoded.sub);
    //     } catch (error) {
    //         throw new UnauthorizedException('Invalid token')
    //     }
    // }
}

