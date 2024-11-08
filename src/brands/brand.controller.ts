import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { Brand } from '@prisma/client';
import { BrandDto } from './dto/brand.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateBrandDto } from './dto/create.brand.dto';


@ApiTags('brands')
@Controller('brands')
export class BrandController {
    constructor(private readonly brandService: BrandService,

    ) { }

    // Get all brands
    @Get()
    @ApiOperation({ summary: 'Retrieve all brands' })
    @ApiResponse({ status: 200, description: 'List of all brands', type: [BrandDto] })
    async getAllBrands(): Promise<Brand[]> {
        return this.brandService.getAllBrands();
    }

    // Get a brand by id
    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a brand by ID' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the brand', type: Number })
    @ApiResponse({ status: 200, description: 'Brand name', type: BrandDto })
    @ApiResponse({ status: 404, description: 'Brand not found' })
    async getBrandById(@Param('id', ParseIntPipe) id: number): Promise<Brand> {
        return await this.brandService.getBrandById(id);
    }

    // Add a new brand
    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a new brand' })
    @ApiBody({ type: CreateBrandDto })
    @ApiResponse({ status: 201, description: 'The brand has been successfully created.', type: BrandDto })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    async create(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
        return this.brandService.addBrand(createBrandDto);
    }

    // Delete a brand
    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a brand by ID' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the brand to delete', type: Number })
    @ApiResponse({ status: 204, description: 'The brand has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Brand not found' })
    @HttpCode(204)
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.brandService.delete(id);
    }

}
