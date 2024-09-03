import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
    @ApiProperty({ example: 4, description: 'Quantity of the product in the order' })
    quantity: number;

    @ApiProperty({ example: 1, description: 'ID of the product' })
    productId: number;
}

export class OrderDto {
    @ApiProperty({ example: 1, description: 'Unique identifier for the order' })
    id: number;

    @ApiProperty({ example: 1, description: 'ID of the user who placed the order' })
    userId: number;

    @ApiProperty({ type: [OrderItemDto], description: 'List of items in the order' })
    items: OrderItemDto[];

    @ApiProperty({ example: 150, description: 'Total amount for the order' })
    totalAmount: number;

    @ApiProperty({ example: '2024-09-02T23:55:19.354Z', description: 'Timestamp when the order was created' })
    createdAt: Date;

    @ApiProperty({ example: '2024-09-02T23:55:19.354Z', description: 'Timestamp when the order was last updated' })
    updatedAt: Date;
}
