import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
    @ApiProperty({ description: 'Amount to be charged in cents' })
    @IsNumber()
    amount: number;

    @ApiProperty({ description: 'Currency for the payment' })
    @IsString()
    currency: string;

    @ApiProperty({ description: 'Source token for payment' })
    @IsString()
    source: string;

    @ApiProperty({ description: 'Description of the payment' })
    @IsString()
    description: string;
}
