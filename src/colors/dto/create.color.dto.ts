import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsUnique } from 'src/decorators/is-unique.decorator';

export class CreateColorDto {
    @ApiProperty({ example: 'New Color', description: 'Color of the product' })
    @IsString()
    @IsUnique('color', 'name')
    name: string;
}
