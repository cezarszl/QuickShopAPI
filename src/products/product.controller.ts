import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, HttpCode, UseGuards, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
import { ApiTags, ApiBody, ApiParam, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @ApiOperation({ summary: 'Retrieve all products' })
    @ApiResponse({ status: 200, description: 'List of all products', type: [ProductDto] })
    @ApiQuery({ name: 'category', required: false, type: String })
    @ApiQuery({ name: 'name', required: false, type: String })
    @ApiQuery({ name: 'minPrice', required: false, type: Number })
    @ApiQuery({ name: 'maxPrice', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit the number of products returned' })
    @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Skip the first N products' })
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(
        @Query('category') category?: string,
        @Query('name') name?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
    ): Promise<Product[]> {
        const filters = {
            category,
            name,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            offset: offset ? parseInt(offset, 10) : undefined,
        }
        return this.productService.findAll(filters);
    }


    @ApiOperation({ summary: 'Retrieve a product by ID' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the product', type: Number })
    @ApiResponse({ status: 200, description: 'Product details', type: ProductDto })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
        return await this.productService.findOne(id);
    }

    @ApiOperation({ summary: 'Create a new product' })
    @ApiBody({ type: CreateProductDto })
    @ApiResponse({ status: 201, description: 'The product has been successfully created.', type: ProductDto })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createProductDto: { category: string, name: string; description: string; imageUrl: string; price: number; ownerId?: number }): Promise<Product> {
        return this.productService.create(createProductDto);
    }

    @ApiOperation({ summary: 'Update an existing product' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the product to update', type: Number })
    @ApiBody({ type: UpdateProductDto })
    @ApiResponse({ status: 200, description: 'The product has been successfully updated.', type: ProductDto })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: { name?: string; description?: string; imageUrl?: string; price?: number },
    ): Promise<Product> {
        return await this.productService.update(id, updateProductDto);
    }

    @ApiOperation({ summary: 'Delete a product by ID' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the product to delete', type: Number })
    @ApiResponse({ status: 204, description: 'The product has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.productService.delete(id);
    }
}
