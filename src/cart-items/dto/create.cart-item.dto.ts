import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { DoesExist } from 'src/decorators/does-exist.decorator';

export class CreateCartItemDto {
    @ApiProperty({ description: 'Quantity of the product in the cart' })
    @IsInt()
    @IsNotEmpty({ message: 'Quantity should not be empty' })
    @IsPositive({ message: 'Quantity must be a positive integer' })
    quantity: number;

    @ApiProperty({ description: 'ID of the user who owns the cart' })
    @IsInt()
    @IsOptional()
    @IsNotEmpty({ message: 'User ID should not be empty' })
    @IsPositive({ message: 'User ID must be a positive integer' })
    @DoesExist('user', 'id')
    userId?: number;

    @ApiProperty({ description: 'ID of the product' })
    @IsInt()
    @IsNotEmpty({ message: 'Product ID should not be empty' })
    @IsPositive({ message: 'Product ID must be a positive integer' })
    @DoesExist('product', 'id')
    productId: number;
}
