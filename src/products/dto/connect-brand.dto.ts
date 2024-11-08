import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';

export class BrandIdDto {
    @ApiProperty({ example: 2, description: 'ID of the brand' })
    @IsNotEmpty({ message: 'Brand ID is required' })
    @IsNumber({}, { message: 'Brand ID must be a number' })
    id: number;
}

export class ConnectBrandDto {
    @ApiProperty({ description: 'Connect brand by ID' })
    @IsNotEmpty({ message: 'Brand is required' })
    @IsObject({ message: 'Brand must be an object' })
    connect: BrandIdDto;
}
