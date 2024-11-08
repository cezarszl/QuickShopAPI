import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBrandDto {
    @ApiProperty({ example: 'New Brand', description: 'Brand of the product' })
    @IsString()
    name: string;
}
