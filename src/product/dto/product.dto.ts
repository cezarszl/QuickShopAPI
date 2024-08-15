import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Laptop' })
    name: string;

    @ApiProperty({ example: 'High-performance laptop' })
    description: string;

    @ApiProperty({ example: 'https://example.com/laptop.jpg' })
    imageUrl: string;

    @ApiProperty({ example: 999.99 })
    price: number;

    @ApiProperty({ example: '2024-08-15T08:00:00Z' })
    createdAt: Date;

    @ApiProperty({ example: '2024-08-15T08:00:00Z' })
    updatedAt: Date;
}
