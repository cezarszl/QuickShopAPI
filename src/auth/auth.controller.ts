import { Controller, Post, Body, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({
        status: 201,
        description: 'User successfully registered and token returned.',
        schema: {
            example: {
                accessToken: 'jwtToken',
            },
        },
    })
    @ApiResponse({
        status: 409,
        description: 'Conflict: User with email already exists.',
    })
    async register(@Body() registerDto: RegisterDto): Promise<string> {
        try {
            return await this.authService.registerUser(registerDto);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException('User already exists');
            }
            throw error;
        }
    }

    @Post('login')
    @ApiOperation({ summary: 'Log in a user' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        description: 'User successfully logged in and token returned.',
        schema: {
            example: {
                accessToken: 'jwtToken',
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized: Invalid credentials.',
    })
    async login(@Body() loginDto: LoginDto): Promise<string> {
        try {
            return await this.authService.login(loginDto);
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw new UnauthorizedException('Invalid credentials');
            }
            throw error;
        }
    }

    @Get('google')
    @ApiOperation({ summary: 'Redirect to Google for authentication' })
    @ApiResponse({ status: 302, description: 'Redirects to Google OAuth2 login page.' })
    googleAuth(@Req() req) {

    }

    // 2. Endpoint do obsługi callbacku od Google
    @Get('google/callback')
    @ApiOperation({ summary: 'Handle Google OAuth2 callback' })
    @ApiResponse({ status: 200, description: 'Returns JWT token after successful Google login.' })
    googleAuthRedirect(@Req() req) {

        const user = req.user;
        return this.authService.login(user);
    }

}
