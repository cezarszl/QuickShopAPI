import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsUUID } from 'class-validator';
import { CartItemDto } from './cart-item.dto';

export class CartDto {
    @ApiProperty({
        description: 'Unique identifier for the cart',
        example: 'b0c57edb-93d7-49ad-81ea-7a8f079f3c7b',
    })
    @IsUUID('4', { message: 'Cart ID must be a valid UUID' })
    cartId: string;

    @ApiProperty({
        description: 'ID of the user who owns the cart (null for anonymous users)',
        required: false,
    })
    @IsOptional()
    @IsInt({ message: 'User ID must be a valid integer' })
    userId?: number;

    @ApiProperty({
        description: 'List of items in the cart',
        type: [CartItemDto],  // Używamy DTO dla elementów koszyka
    })
    items: CartItemDto[];

    @ApiProperty({
        description: 'Creation timestamp of the cart',
        example: '2025-01-07T12:00:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Last update timestamp of the cart',
        example: '2025-01-07T12:30:00.000Z',
    })
    updatedAt: Date;
}
