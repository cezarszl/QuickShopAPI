import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsUrl } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({ example: 'Bronze', description: 'Category of the product' })
    @IsNotEmpty({ message: 'Category is required' })
    @IsString({ message: 'Category must be a string' })
    category: string;

    @ApiProperty({ example: 'New Product', description: 'Name of the product' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @ApiProperty({ example: 'This is a description of the product', description: 'Description of the product' })
    @IsNotEmpty({ message: 'Description is required' })
    @IsString({ message: 'Description must be a string' })
    description: string;

    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL of the product image' })
    @IsNotEmpty({ message: 'Image URL is required' })
    @IsString({ message: 'Image URL must be a string' })
    @IsUrl({}, { message: 'Image URL must be a valid URL' })
    imageUrl: string;

    @ApiProperty({ example: 199.99, description: 'Price of the product' })
    @IsNotEmpty({ message: 'Price is required' })
    @IsNumber({}, { message: 'Price must be a number' })
    price: number;
}
