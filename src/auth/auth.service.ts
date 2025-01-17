import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { RegisterResponseDto } from './dto/register.response.dto';
import { LoginDtoResponse } from './dto/login.response.dto';



@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async registerUser(registerDto: RegisterDto): Promise<RegisterResponseDto> {
        const { email, password, name, googleId } = registerDto;

        //Hashing password

        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;


        //Creating a new user
        const newUser = await this.userService.createUser({
            email,
            password: hashedPassword,
            name,
            googleId,
        });

        //Generating JWT
        const payload: JwtPayload = { email: newUser.email, sub: newUser.id };
        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                googleId: newUser.googleId
            }
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
        //Generating JWT
        const payload: JwtPayload = { email: user.email, sub: user.id };
        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                googleId: user.googleId
            }
        };
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

