import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsUUID } from 'class-validator';
import { DoesExist } from 'src/decorators/does-exist.decorator';

export class CreateCartItemDto {
    @ApiProperty({ description: 'Quantity of the product in the cart' })
    @IsInt()
    @IsNotEmpty({ message: 'Quantity should not be empty' })
    @IsPositive({ message: 'Quantity must be a positive integer' })
    quantity: number;

    @ApiProperty({ description: 'ID of the cart to which the item belongs' })
    @IsUUID('4', { message: 'Cart ID must be a valid UUID' })
    @IsNotEmpty({ message: 'Cart ID should not be empty' })
    @DoesExist('cart', 'id')
    cartId: string;

    @ApiProperty({ description: 'ID of the product' })
    @IsInt()
    @IsNotEmpty({ message: 'Product ID should not be empty' })
    @IsPositive({ message: 'Product ID must be a positive integer' })
    @DoesExist('product', 'id')
    productId: number;
}
