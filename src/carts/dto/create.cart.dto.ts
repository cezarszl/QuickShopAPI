import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateCartDto {
    @ApiPropertyOptional({
        description: 'ID of the user who owns the cart. Optional - can be used for guest carts',
        type: Number
    })
    @IsOptional()
    @IsNumber()
    userId?: number;
}