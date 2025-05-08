import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    UseGuards,
    Request,
    ParseIntPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('favorites')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) { }

    @Get()
    @ApiOperation({ summary: 'Get all favorite products for the user' })
    @ApiResponse({ status: 200, description: 'List of favorite products' })
    async getAll(@Request() req) {
        return this.favoritesService.getUserFavorites(req.user.id);
    }

    @Post()
    @ApiOperation({ summary: 'Add a product to favorites' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                productId: { type: 'integer', example: 1 }
            },
            required: ['productId']
        }
    })
    @ApiResponse({ status: 201, description: 'Product added to favorites' })
    async add(@Request() req, @Body('productId', ParseIntPipe) productId: number) {
        return this.favoritesService.addFavorite(req.user.id, productId);
    }

    @Delete(':productId')
    @ApiOperation({ summary: 'Remove a product from favorites' })
    @ApiParam({ name: 'productId', type: 'integer' })
    @ApiResponse({ status: 200, description: 'Product removed from favorites' })
    async remove(@Request() req, @Param('productId', ParseIntPipe) productId: number) {
        return this.favoritesService.removeFavorite(req.user.id, productId);
    }

    @Get(':productId')
    @ApiOperation({ summary: 'Check if product is in favorites' })
    @ApiParam({ name: 'productId', type: 'integer' })
    @ApiResponse({ status: 200, description: 'Returns true/false' })
    async isFavorite(@Request() req, @Param('productId', ParseIntPipe) productId: number) {
        return this.favoritesService.isFavorite(req.user.id, productId);
    }
}
