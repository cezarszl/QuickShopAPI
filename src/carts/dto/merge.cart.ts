import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class MergeCartDto {
    @ApiProperty({ description: 'ID of the logged-in user', example: 1 })
    @IsNumber()
    userId: number;

    @ApiProperty({ description: 'ID of the anonymous cart', example: '4aa036f0-ef0d-4498-831d-0888602c35b3' })
    @IsUUID('4', { message: 'Cart ID must be a valid UUID' })
    anonymousCartId: string;
}
