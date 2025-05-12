import { ApiProperty } from "@nestjs/swagger";

class UserInfoDto {

    @ApiProperty({ description: 'ID of the user' })
    id: number;

    @ApiProperty({ description: 'Email of the user' })
    email: string;

    @ApiProperty({ description: 'Name of the user' })
    name: string;

    @ApiProperty({ description: 'Google ID if registered via Google', required: false })
    googleId?: string;

    @ApiProperty({ example: '2024-09-02T23:55:19.354Z', description: 'Timestamp when the user was created' })
    createdAt: Date;
}

export class RegisterResponseDto {
    @ApiProperty({ description: 'JWT token for the authenticated user' })
    accessToken: string;

    @ApiProperty({ description: 'Refresh token for the authenticated user' })
    refreshToken: string;

    @ApiProperty({ description: 'Information about the user' })
    user: UserInfoDto;
}
