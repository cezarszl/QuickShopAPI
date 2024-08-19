import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'Email of the user',
        example: 'user@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password of the user',
        example: 'P@ssw0rd',
        minLength: 6,
    })
    @IsString()
    // @MinLength(6) // Optional: Ensure that password has a minimum length
    password: string;
}
