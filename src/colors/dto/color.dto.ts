import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ColorDto {
    @ApiProperty({ example: 1, description: 'Color ID' })
    @IsNumber()
    id: number;

    @ApiProperty({ example: 'New Color', description: 'Color of the product' })
    @IsString()
    name: string;
}
