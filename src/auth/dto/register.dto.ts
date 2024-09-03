import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        description: 'Email of the user',
        example: 'user@example.com',
    })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({
        description: 'Password of the user',
        example: 'P@ssw0rd',
        minLength: 6,
    })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @ApiProperty({
        description: 'Name of the user',
        example: 'John Doe',
    })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @ApiProperty({
        description: 'Google ID of the user',
        example: '1234567890',
    })
    @IsString({ message: 'Google ID must be a string' })
    @IsOptional()
    googleId?: string;
}
