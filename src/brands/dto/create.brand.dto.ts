import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsUnique } from 'src/decorators/is-unique.decorator';
export class CreateBrandDto {
    @ApiProperty({ example: 'New Brand', description: 'Brand of the product' })
    @IsUnique('brand', 'name')
    @IsString()
    name: string;
}
