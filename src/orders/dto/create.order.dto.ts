import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsNumber, IsObject } from 'class-validator';

export class CreateOrderDto {
    @ApiProperty({ example: 1, description: 'ID of the user placing the order' })
    @IsInt()
    @IsNotEmpty({ message: 'User ID should not be empty' })
    @IsPositive({ message: 'User ID must be a positive integer' })
    userId: number;

    @IsObject()
    @IsNotEmpty({ message: 'Items should not be empty' })
    @ApiProperty({ type: 'object', description: 'JSON object representing items in the order' })
    items: any;

    @ApiProperty({ example: 150.00, description: 'Total amount for the order' })
    @IsNumber({}, { message: 'Total amount must be a number' })
    @IsPositive({ message: 'Total amount must be a positive number' })
    totalAmount: number;
}
