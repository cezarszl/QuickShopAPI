import { ApiProperty } from "@nestjs/swagger";

class UserInfoDto {
    @ApiProperty({ description: 'Email of the registered user' })
    email: string;

    @ApiProperty({ description: 'Name of the registered user' })
    name: string;

    @ApiProperty({ description: 'Google ID if registered via Google', required: false })
    googleId?: string;
}

export class RegisterResponseDto {
    @ApiProperty({ description: 'JWT token for the authenticated user' })
    accessToken: string;

    @ApiProperty({ description: 'Information about the registered user' })
    user: UserInfoDto;
}
