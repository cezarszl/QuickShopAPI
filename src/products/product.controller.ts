import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, HttpCode, UseGuards, Query, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
import { ApiTags, ApiBody, ApiParam, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('products')
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @ApiOperation({ summary: 'Retrieve all products' })
    @ApiResponse({ status: 200, description: 'List of all products', type: [ProductDto] })
    @ApiQuery({ name: 'name', required: false, type: String })
    @ApiQuery({ name: 'category', required: false, type: Number })
    @ApiQuery({ name: 'minPrice', required: false, type: Number })
    @ApiQuery({ name: 'maxPrice', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit the number of products returned' })
    @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Skip the first N products' })
    @Get()
    async findAll(
        @Query('category') category?: number,
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
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
        return await this.productService.findOne(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a new product' })
    @ApiBody({ type: CreateProductDto })
    @ApiResponse({ status: 201, description: 'The product has been successfully created.', type: ProductDto })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @Post()
    async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
        return this.productService.create(createProductDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update an existing product' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the product to update', type: Number })
    @ApiBody({ type: CreateProductDto })
    @ApiResponse({ status: 200, description: 'The product has been successfully updated.', type: ProductDto })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
    ): Promise<Product> {
        return await this.productService.update(id, updateProductDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a product by ID' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the product to delete', type: Number })
    @ApiResponse({ status: 204, description: 'The product has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @HttpCode(204)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.productService.delete(id);
    }
}
