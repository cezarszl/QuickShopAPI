import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CartItemDto } from './cart-item.dto';

export class CartDto {
    @ApiProperty({
        description: 'Unique identifier for the cart',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string;

    @ApiPropertyOptional({
        description: 'ID of the user who owns the cart. Optional for guest carts',
        type: Number
    })
    userId?: number;

    @ApiProperty({
        description: 'Items in the cart',
        type: [CartItemDto]
    })
    items: CartItemDto[];

    @ApiProperty({
        description: 'Creation timestamp',
        type: Date
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Last updated timestamp',
        type: Date
    })
    updatedAt: Date;
}