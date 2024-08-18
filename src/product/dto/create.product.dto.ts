import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'New Product', description: 'Name of the product' })
    name: string;

    @ApiProperty({ example: 'This is a description of the product', description: 'Description of the product' })
    description: string;

    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL of the product image' })
    imageUrl: string;

    @ApiProperty({ example: 199.99, description: 'Price of the product' })
    price: number;
}
