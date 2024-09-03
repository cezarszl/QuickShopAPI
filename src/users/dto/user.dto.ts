import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({ example: 1, description: 'Unique identifier for the user' })
    id: number;

    @ApiProperty({ example: 'Matilda_Brekke@hotmail.com', description: 'Email address of the user' })
    email: string;

    @ApiProperty({ example: 'Mxpv4Yt7xJhPNvp', description: 'Hashed password of the user' })
    password: string;

    @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
    name: string;

    @ApiProperty({ example: null, description: 'Google ID if the user signed up with Google' })
    googleId: string | null;

    @ApiProperty({ example: null, description: 'Facebook ID if the user signed up with Facebook' })
    facebookId: string | null;

    @ApiProperty({ example: '2024-08-30T23:58:25.172Z', description: 'Timestamp when the user was created' })
    createdAt: Date;

    @ApiProperty({ example: '2024-08-31T00:46:08.383Z', description: 'Timestamp when the user was last updated' })
    updatedAt: Date;
}
