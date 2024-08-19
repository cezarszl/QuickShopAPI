import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto): Promise<string> {
        const { email, password, name } = registerDto;

        // Checking if user already exists
        const existingUser = await this.userService.findUserByEmail(email);
        if (existingUser) {
            throw new ConflictException(`User with email ${email} already exist`);
        }

        //Hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Creating a new user
        const newUser = await this.userService.createUser({
            email,
            password: hashedPassword,
            name,
        });

        //Generating JWT
        const payload: JwtPayload = { email: newUser.email, sub: newUser.id };
        return this.jwtService.sign(payload);

    }

    async login(loginDto: LoginDto): Promise<string> {
        const { email, password } = loginDto;

        //Finding use by email
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credientals');
        }
        //Comparing passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
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
