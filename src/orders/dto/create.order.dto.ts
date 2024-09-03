import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiProperty({ example: 1, description: 'ID of the user placing the order' })
    userId: number;

    @ApiProperty({ type: [Object], description: 'List of items in the order' })
    items: { productId: number; quantity: number }[];

    @ApiProperty({ example: 150.00, description: 'Total amount for the order' })
    totalAmount: number;
}
