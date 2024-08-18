import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'user@domain.com', description: 'Email address of the user' })
    email: string;

    @ApiProperty({ example: 'securePassword123', description: 'Password for the user' })
    password: string;

    @ApiProperty({ example: 'John Doe', description: 'Name of the user' })
    name: string;

    @ApiProperty({ example: 'abc123', description: 'Google ID if available', nullable: true })
    googleId?: string;

    @ApiProperty({ example: 'def456', description: 'Facebook ID if available', nullable: true })
    facebookId?: string;
}
