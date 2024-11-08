import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class BrandDto {
    @ApiProperty({ example: 1, description: 'Brand ID' })
    @IsNumber()
    id: number;

    @ApiProperty({ example: 'Brand', description: 'Brand of the product' })
    @IsString()
    name: string;
}
