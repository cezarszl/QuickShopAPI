import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ColorDto {
    @ApiProperty({ example: 'New Color', description: 'Color of the product' })
    @IsString()
    name: string;
}
