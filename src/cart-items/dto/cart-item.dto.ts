import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
    @ApiProperty({ description: 'Unique identifier for the cart item' })
    id: number;

    @ApiProperty({ description: 'Quantity of the product in the cart' })
    quantity: number;

    @ApiProperty({ description: 'ID of the user who owns the cart' })
    userId: number;

    @ApiProperty({ description: 'ID of the product' })
    productId: number;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Last updated timestamp' })
    updatedAt: Date;
}
