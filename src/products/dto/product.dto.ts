import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl, IsDate } from 'class-validator';

export class ProductDto {
    @ApiProperty({ example: 1, description: 'Product ID' })
    @IsNumber()
    id: number;

    @ApiProperty({ example: 'New Product', description: 'Name of the product' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'This is a description of the product', description: 'Description of the product' })
    @IsString()
    description: string;

    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL of the product image' })
    @IsUrl()
    imageUrl: string;

    @ApiProperty({ example: 199.99, description: 'Price of the product' })
    @IsNumber()
    price: number;

    @ApiProperty({ example: '2023-08-18T00:00:00Z', description: 'Date and time when the product was created' })
    @IsDate()
    createdAt: Date;

    @ApiProperty({ example: '2024-08-18T00:00:00Z', description: 'Date and time when the product was last updated' })
    @IsDate()
    updatedAt: Date;

    @ApiProperty({ example: 3, description: 'ID of the category' })
    @IsNumber()
    categoryId: number;

    @ApiProperty({ example: 1, description: 'User ID of the product owner', nullable: true })
    @IsOptional()
    @IsNumber()
    ownerId?: number;
}
