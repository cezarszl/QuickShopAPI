import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

export class CartItemDto {
    @ApiProperty({
        description: 'ID of the cart to which the item belongs. Forms composite primary key with productId.'
    })
    cartId: string;

    @ApiProperty({
        description: 'ID of the product in the cart. Forms composite primary key with cartId.'
    })
    productId: number;

    @ApiProperty({ description: 'Quantity of the product in the cart' })
    quantity: number;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Last updated timestamp' })
    updatedAt: Date;
}