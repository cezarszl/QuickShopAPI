import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'Updated name of the user', required: false })
    name?: string;
}