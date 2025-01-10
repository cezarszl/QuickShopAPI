import { ApiProperty } from "@nestjs/swagger";
import { ProductDto } from "./product.dto";

export class ProductsResponseDto {
    @ApiProperty({ type: [ProductDto] })
    products: ProductDto[];

    @ApiProperty({ type: Number, example: 1, description: 'Total amount of products' })
    totalCount: number;
}
