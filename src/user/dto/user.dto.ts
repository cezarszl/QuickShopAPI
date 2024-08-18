import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({ example: 1, description: 'User ID' })
    id: number;

    @ApiProperty({ example: 'user@domain.com', description: 'Email address of the user' })
    email: string;

    @ApiProperty({ example: 'John Doe', description: 'Name of the user' })
    name: string;
}
