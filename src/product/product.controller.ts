import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
import { ApiTags, ApiBody, ApiParam, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @ApiOperation({ summary: 'Retrieve all products' })
    @ApiResponse({ status: 200, description: 'List of all products', type: [ProductDto] })
    @Get()
    async findAll(): Promise<Product[]> {
        return this.productService.findAll();
    }

    // Endpoint: GET /products/:id
    @ApiOperation({ summary: 'Retrieve a product by ID' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the product', type: Number })
    @ApiResponse({ status: 200, description: 'Product details', type: ProductDto })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Product> {
        return await this.productService.findOne(id);
    }

    @ApiOperation({ summary: 'Create a new product' })
    @ApiBody({ type: CreateProductDto })
    @ApiResponse({ status: 201, description: 'The product has been successfully created.', type: ProductDto })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @Post()
    async create(@Body() createProductDto: { name: string; description: string; imageUrl: string; price: number; ownerId?: number }): Promise<Product> {
        return this.productService.create(createProductDto);
    }

    @ApiOperation({ summary: 'Update an existing product' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the product to update', type: Number })
    @ApiBody({ type: UpdateProductDto })
    @ApiResponse({ status: 200, description: 'The product has been successfully updated.', type: ProductDto })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateProductDto: { name?: string; description?: string; imageUrl?: string; price?: number },
    ): Promise<Product> {
        return await this.productService.update(id, updateProductDto);
    }

    @ApiOperation({ summary: 'Delete a product by ID' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the product to delete', type: Number })
    @ApiResponse({ status: 200, description: 'The product has been successfully deleted.', type: ProductDto })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<Product> {
        return await this.productService.delete(id);
    }
}
