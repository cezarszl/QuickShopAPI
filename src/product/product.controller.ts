import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    // Endpoint: GET /products
    @Get()
    async findAll(): Promise<Product[]> {
        return this.productService.findAll();
    }

    // Endpoint: GET /products/:id
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Product> {
        const product = await this.productService.findOne(id);
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    // Endpoint: POST /products
    @Post()
    async create(@Body() createProductDto: { name: string; description: string; imageUrl: string; price: number; ownerId?: number }): Promise<Product> {
        return this.productService.create(createProductDto);
    }

    // Endpoint: PUT /products/:id
    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateProductDto: { name?: string; description?: string; imageUrl?: string; price?: number },
    ): Promise<Product> {
        const product = await this.productService.update(id, updateProductDto);
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    // Endpoint: DELETE /products/:id
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<Product> {
        const product = await this.productService.delete(id);
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
}
