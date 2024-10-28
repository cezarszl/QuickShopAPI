import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsUrl, ValidateNested } from 'class-validator';
import { ConnectCategoryDto } from 'src/products/dto/connect-category.dto';

export class CreateProductDto {
    @ApiProperty({ type: ConnectCategoryDto, description: 'Category of the product' })
    @IsNotEmpty({ message: 'Category is required' })
    @ValidateNested()
    @Type(() => ConnectCategoryDto)
    category: ConnectCategoryDto;

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

    @ApiProperty({ example: 'Abibas', description: 'Brand of the product' })
    @IsNotEmpty({ message: 'Brand is required' })
    @IsString({ message: 'Brand must be a string' })
    brand: string;

    @ApiProperty({ example: 'RED', description: 'Color of the product' })
    @IsNotEmpty({ message: 'Color is required' })
    @IsString({ message: 'Color must be a string' })
    color: string;
}
