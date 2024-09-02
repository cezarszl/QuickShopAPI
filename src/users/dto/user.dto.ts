import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({ example: 1, description: 'User ID' })
    id: number;

    @ApiProperty({ example: 'user@domain.com', description: 'Email address of the user' })
    email: string;

    @ApiProperty({ example: 'John Doe', description: 'Name of the user' })
    name: string;

    @ApiProperty({ example: '2023-08-18T00:00:00Z', description: 'Date and time when the user was created' })
    createdAt: Date;

    @ApiProperty({ example: '2024-08-18T00:00:00Z', description: 'Date and time when the user was last updated' })
    updatedAt: Date;

    @ApiProperty({ example: 'abc123', description: 'Google ID if available', nullable: true })
    googleId?: string;

    @ApiProperty({ example: 'def456', description: 'Facebook ID if available', nullable: true })
    facebookId?: string;

}
