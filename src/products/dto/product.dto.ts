import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class ProductDto {
    @ApiProperty({ example: 1, description: 'Unique identifier of the product' })
    @IsNumber()
    id: number;

    @ApiProperty({ example: 'NoiseBlock Earbuds', description: 'Name of the product' })
    @IsString()
    name: string;

    @ApiProperty({
        example: 'Compact wireless earbuds with active noise cancellation and charging case.',
        description: 'Detailed description of the product',
    })
    @IsString()
    description: string;

    @ApiProperty({
        example: '/images/NoiseBlock_Earbuds.webp',
        description: 'Relative path to the product image',
    })
    @IsString()
    imageUrl: string;

    @ApiProperty({ example: 149.99, description: 'Price of the product in USD' })
    @IsNumber()
    price: number;

    @ApiProperty({
        example: '2025-05-09T21:35:03.862Z',
        description: 'Timestamp of product creation',
        type: String,
    })
    createdAt: Date;

    @ApiProperty({
        example: '2025-05-09T21:35:03.862Z',
        description: 'Timestamp of the last update',
        type: String,
    })
    updatedAt: Date;

    @ApiProperty({
        example: 1,
        description: 'ID of the product owner, if applicable',
        nullable: true,
    })
    @IsOptional()
    @IsNumber()
    ownerId?: number;

    @ApiProperty({ example: 1, description: 'ID of the category the product belongs to' })
    @IsNumber()
    categoryId: number;

    @ApiProperty({ example: 5, description: 'ID of the brand the product is associated with' })
    @IsNumber()
    brandId: number;

    @ApiProperty({ example: 3, description: 'ID of the color of the product' })
    @IsNumber()
    colorId: number;

    // 🆕 Additional readable fields for frontend

    @ApiProperty({
        example: 'electronics',
        description: 'Human-readable name of the category',
    })
    @IsOptional()
    @IsString()
    categoryName?: string;

    @ApiProperty({
        example: 'Nuke',
        description: 'Human-readable name of the brand',
    })
    @IsOptional()
    @IsString()
    brandName?: string;

    @ApiProperty({
        example: 'BLACK',
        description: 'Human-readable name of the color',
    })
    @IsOptional()
    @IsString()
    colorName?: string;
}
