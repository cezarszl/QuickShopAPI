import { IsArray, IsEmail, IsNotEmpty, ValidateNested, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CartItemDto {
    @ApiProperty({ example: 'NoiseBlock Earbuds' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 149.99 })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    @IsNumber()
    quantity?: number;
}

export class CustomerDto {
    @ApiProperty({ example: 'John' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: 'Acme Inc.' })
    @IsString()
    @IsOptional()
    companyName: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'PL' })
    @IsString()
    @IsNotEmpty()
    country: string;
}

export class CreateCheckoutSessionDto {
    @ApiProperty({
        type: CustomerDto,
        example: {
            firstName: 'John',
            lastName: 'Doe',
            companyName: 'Acme Inc.',
            email: 'john.doe@example.com',
            country: 'PL',
        },
    })
    @ValidateNested()
    @Type(() => CustomerDto)
    customer: CustomerDto;

    @ApiProperty({
        type: [CartItemDto],
        example: [
            {
                name: 'NoiseBlock Earbuds',
                price: 149.99,
                quantity: 2,
            },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    cart: CartItemDto[];
}
