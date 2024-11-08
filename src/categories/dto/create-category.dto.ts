import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Electronics', description: 'Name of the category' })
    @IsString({ message: 'name must be a string' })
    name: string;
}
