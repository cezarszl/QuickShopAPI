import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';

export class CategoryIdDto {
    @ApiProperty({ example: 4, description: 'ID of the category' })
    @IsNotEmpty({ message: 'Category ID is required' })
    @IsNumber({}, { message: 'Category ID must be a number' })
    id: number;
}

export class ConnectCategoryDto {
    @ApiProperty({ description: 'Connect category by ID' })
    @IsNotEmpty({ message: 'Category is required' })
    @IsObject({ message: 'Category must be an object' })
    connect: CategoryIdDto;
}
