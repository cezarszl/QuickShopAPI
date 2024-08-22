import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async registerUser(registerDto: RegisterDto): Promise<string> {
        const { email, password, name, googleId } = registerDto;

        await this.userService.checkIfUserExists(email);

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
        return this.jwtService.sign(payload);

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

    async login(loginDto: LoginDto): Promise<string> {
        const { email, password } = loginDto;

        //Finding use by email
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credientals');
        }
        // Comparing passwords
        if (!user.password || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        //Generating JWT
        const payload: JwtPayload = { email: user.email, sub: user.id };
        return this.jwtService.sign(payload);
    }

    async validateToken(token: string): Promise<any> {
        try {
            const decoded = this.jwtService.verify(token);
            return await this.userService.findUserById(decoded.sub);
        } catch (error) {
            throw new UnauthorizedException('Invalid token')
        }
    }
}

