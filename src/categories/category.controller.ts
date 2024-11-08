import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Get('min-prices')
    @ApiOperation({ summary: 'Get minimum price from each category' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved minimum prices.' })
    async getLowestPricesFromEachCategory() {
        return this.categoryService.getLowestPricesFromEachCategory();
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved categories.' })
    async getAllCategories() {
        return this.categoryService.getAllCategories();
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a new category' })
    @ApiBody({ type: CreateCategoryDto })
    @ApiResponse({ status: 201, description: 'Category successfully created.' })
    async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.createCategory(createCategoryDto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update a category' })
    @ApiParam({ name: 'id', type: 'number', description: 'ID of the category to update' })
    @ApiBody({ type: UpdateCategoryDto })
    @ApiResponse({ status: 200, description: 'Category successfully updated.' })
    async updateCategory(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.updateCategory(+id, updateCategoryDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a category' })
    @ApiParam({ name: 'id', type: 'number', description: 'ID of the category to delete' })
    @ApiResponse({ status: 200, description: 'Category successfully deleted.' })
    async deleteCategory(@Param('id') id: number) {
        return this.categoryService.deleteCategory(+id);
    }
}
