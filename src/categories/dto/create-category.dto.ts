import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsUnique } from 'src/decorators/is-unique.decorator';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Electronics', description: 'Name of the category' })
    @IsUnique('category', 'name')
    @IsString({ message: 'name must be a string' })
    name: string;
}
