import { Controller, Post, Body, Get, Req, UseGuards, InternalServerErrorException, BadRequestException, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { RegisterResponseDto } from './dto/register.response.dto';
import { Request } from 'express';
import { LoginDtoResponse } from './dto/login.response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TokenRefreshResponse } from './dto/token-refresh.response.dto';
import { User } from '@prisma/client';

@ApiTags('auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({
        status: 201,
        description: 'User successfully registered and token returned.',
        type: RegisterResponseDto
    })
    @ApiResponse({
        status: 409,
        description: 'Conflict: User with email already exists.',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error occurred during registration.',
    })
    async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
        try {
            return await this.authService.registerUser(registerDto);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException('User already exists');
            }
            if (error instanceof BadRequestException) {
                throw error;
            }
            // Log unexpected errors
            console.error('Registration error:', error);
            throw new InternalServerErrorException('Registration failed');
        }
    }

    @Post('login')
    @ApiOperation({ summary: 'Log in a user' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        description: 'User successfully logged in and token returned.',
        type: LoginDtoResponse,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized: Invalid credentials.',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error occurred during login.',
    })
    async login(@Body() loginDto: LoginDto): Promise<LoginDtoResponse> {
        try {
            return await this.authService.login(loginDto);
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw new UnauthorizedException('Invalid credentials');
            }
            throw error;
        }
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiBody({
        schema: {
            properties: {
                refreshToken: { type: 'string' }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'New tokens generated successfully',
        type: TokenRefreshResponse
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid or expired refresh token'
    })
    async refreshToken(
        @Body('refreshToken') refreshToken: string
    ): Promise<TokenRefreshResponse> {
        return this.authService.refreshToken(refreshToken);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Logout user' })
    async logout(
        @Headers('refresh-token') refreshToken: string,
        @Req() req: Request & { user: User }
    ) {
        await this.authService.revokeRefreshToken(refreshToken);
        return { message: 'Logged out successfully' };
    }

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: 'Redirect to Google for authentication' })
    @ApiResponse({ status: 302, description: 'Redirects to Google OAuth2 login page.' })
    googleAuth(@Req() req: Request) {
        // This endpoint initiates Google OAuth flow
        // The actual redirect is handled by GoogleAuthGuard
        return;
    }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: 'Handle Google OAuth2 callback' })
    @ApiResponse({ status: 200, description: 'Returns JWT token after successful Google login.', type: RegisterResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid Google login or failed to authenticate.' })
    googleAuthRedirect(@Req() req: Request) {

        return req.user;
    }

}
