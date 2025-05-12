import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsNumber, ValidateNested, ArrayMinSize, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order.dto';

export class CreateOrderDto {
    @ApiProperty({ example: 1, description: 'ID of the user placing the order' })
    @IsInt()
    @IsNotEmpty({ message: 'User ID should not be empty' })
    @IsPositive({ message: 'User ID must be a positive integer' })
    userId: number;

    @ApiProperty({
        type: [OrderItemDto],
        description: 'List of items in the order (productId & quantity)',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ApiProperty({ example: 150.0, description: 'Total amount for the order' })
    @IsNumber()
    @IsPositive()
    totalAmount: number;
}
