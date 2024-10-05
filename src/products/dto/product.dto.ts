import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
    @ApiProperty({ example: 1, description: 'Product ID' })
    id: number;

    @ApiProperty({ example: 'New Product', description: 'Name of the product' })
    name: string;

    @ApiProperty({ example: 'This is a description of the product', description: 'Description of the product' })
    description: string;

    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL of the product image' })
    imageUrl: string;

    @ApiProperty({ example: 199.99, description: 'Price of the product' })
    price: number;

    @ApiProperty({ example: '2023-08-18T00:00:00Z', description: 'Date and time when the product was created' })
    createdAt: Date;

    @ApiProperty({ example: '2024-08-18T00:00:00Z', description: 'Date and time when the product was last updated' })
    updatedAt: Date;

    @ApiProperty({ example: 3, description: 'ID of the category' })
    categoryId: number;

    @ApiProperty({ example: 1, description: 'User ID of the product owner', nullable: true })
    ownerId?: number;
}
