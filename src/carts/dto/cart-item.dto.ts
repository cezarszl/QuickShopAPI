import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

export class CartItemDto {
    @ApiProperty({
        description: 'ID of the cart to which the item belongs. Forms composite primary key with productId.',
        example: 'b0c57edb-93d7-49ad-81ea-7a8f079f3c7b'
    })
    cartId: string;

    @ApiProperty({
        description: 'ID of the product in the cart. Forms composite primary key with cartId.',
        example: '56'
    })
    productId: number;

    @ApiProperty({
        description: 'Quantity of the product in the cart',
        example: '5'
    })
    quantity: number;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Last updated timestamp' })
    updatedAt: Date;
}