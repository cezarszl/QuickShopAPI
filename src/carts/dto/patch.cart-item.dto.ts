import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class PatchCartItemDto {
    @ApiProperty({
        description: 'Quantity of the product in the cart',
        example: '6'
    })
    @IsInt()
    @IsNotEmpty({ message: 'Quantity should not be empty' })
    @IsPositive({ message: 'Quantity must be a positive integer' })
    quantity: number;
}
