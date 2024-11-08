import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ColorService } from './color.service';
import { Color } from '@prisma/client';
import { ColorDto } from './dto/color.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateColorDto } from './dto/create.color.dto';


@ApiTags('colors')
@Controller('colors')
export class ColorController {
    constructor(private readonly colorService: ColorService,

    ) { }

    // Get all colors
    @Get()
    @ApiOperation({ summary: 'Retrieve all colors' })
    @ApiResponse({ status: 200, description: 'List of all colors', type: [ColorDto] })
    async getAllColors(): Promise<Color[]> {
        return this.colorService.getAllColors();
    }

    // Get a color by id
    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a color by ID' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the color', type: Number })
    @ApiResponse({ status: 200, description: 'Color name', type: ColorDto })
    @ApiResponse({ status: 404, description: 'Color not found' })
    async getColorById(@Param('id', ParseIntPipe) id: number): Promise<Color> {
        return await this.colorService.getColorById(id);
    }

    // Add a new color
    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a new color' })
    @ApiBody({ type: CreateColorDto })
    @ApiResponse({ status: 201, description: 'The color has been successfully created.', type: ColorDto })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    async create(@Body() createColorDto: CreateColorDto): Promise<Color> {
        return this.colorService.addColor(createColorDto);
    }

    // Delete a color
    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a color by ID' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the color to delete', type: Number })
    @ApiResponse({ status: 204, description: 'The color has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Color not found' })
    @HttpCode(204)
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.colorService.delete(id);
    }

}
