import { Controller, Post, Delete, Patch, Get, Param, Body, ParseIntPipe, HttpCode, UseGuards, HttpStatus, Headers, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { CartItemService } from './cart-item.service';
import { CartItemDto } from './dto/cart-item.dto';
import { CartItem } from '@prisma/client';
import { CreateCartItemDto } from './dto/create.cart-item.dto';
import { PatchCartItemDto } from './dto/patch.cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('cart items')
@Controller('cart-items')
export class CartItemController {
    constructor(private readonly cartItemService: CartItemService) { }

    @Post()
    @ApiOperation({ summary: 'Add an item to the cart' })
    @ApiResponse({ status: 201, description: 'Item added to the cart', type: CartItemDto })
    @ApiHeader({
        name: 'cartId',
        description: 'Optional cart ID from headers',
        required: false,
    })
    @ApiBody({ type: CreateCartItemDto })
    async addItem(
        @Body() createCartItemDto: CreateCartItemDto,
        @Headers('cartId') cartId?: string | null
    ): Promise<CartItem> {
        const { userId, productId, quantity } = createCartItemDto;

        if (!userId && !cartId) {
            throw new BadRequestException('Either userId or cartId must be provided');
        }

        return this.cartItemService.addItem(cartId, userId, productId, quantity);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Remove an item from the cart' })
    @ApiResponse({ status: 204, description: 'Item removed from the cart' })
    @ApiResponse({ status: 404, description: 'Item not found.' })
    @ApiParam({ name: 'id', description: 'ID of the cart item to remove' })
    async removeItem(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.cartItemService.removeItem(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('clear/:userId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Clear the entire cart for a user' })
    @ApiResponse({ status: 204, description: 'Cart cleared successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiParam({ name: 'userId', description: 'ID of the user whose cart will be cleared' })

    async clearCart(@Param('userId', ParseIntPipe) userId: number): Promise<void> {
        await this.cartItemService.clearCart(userId);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiOperation({ summary: 'Update the quantity of an item in the cart' })
    @ApiResponse({ status: 200, description: 'Item quantity updated', type: CartItemDto })
    @ApiResponse({ status: 404, description: 'Item not found.' })
    @ApiParam({ name: 'id', description: 'ID of the cart item to update' })
    @ApiBody({ type: PatchCartItemDto, description: 'Updated quantity for the cart item' })
    async updateQuantity(
        @Param('id', ParseIntPipe) id: number,
        @Body() patchCartItemDto: PatchCartItemDto
    ): Promise<CartItem> {
        return this.cartItemService.updateQuantity(id, patchCartItemDto.quantity);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':userId')
    @ApiOperation({ summary: 'Get all items in the cart for a user' })
    @ApiResponse({ status: 200, description: 'List of cart items', type: [CartItemDto] })
    @ApiResponse({ status: 404, description: 'Cart items not found.' })
    @ApiParam({ name: 'userId', description: 'ID of the user whose cart items are to be retrieved' })
    async getCartItems(@Param('userId', ParseIntPipe) userId: number): Promise<CartItem[]> {
        return await this.cartItemService.getCartItems(userId);

    }
}
