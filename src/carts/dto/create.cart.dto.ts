import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { DoesExist } from 'src/decorators/does-exist.decorator';

export class CreateCartDto {
    @ApiPropertyOptional({
        description: 'Optional ID of the user to whom the cart belongs.',
        required: false,
        example: 126
    })
    @IsInt()
    @IsOptional()
    @DoesExist('user', 'id')
    @IsPositive({ message: 'User ID must be a positive integer' })
    userId?: number;
}
