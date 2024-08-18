import { Controller, Post, Delete, Patch, Get, Param, Body, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CartItemService } from './cart-item.service';
import { CartItemDto } from './dto/cart-item.dto';
import { CartItem } from '@prisma/client';

@ApiTags('Cart Items')
@Controller('cart-items')
export class CartItemController {
    constructor(private readonly cartItemService: CartItemService) { }

    @Post()
    @ApiOperation({ summary: 'Add an item to the cart' })
    @ApiResponse({ status: 201, description: 'Item added to the cart', type: CartItemDto })
    @ApiBody({ type: CartItemDto })
    async addItem(
        @Body('userId') userId: number,
        @Body('productId') productId: number,
        @Body('quantity') quantity: number,
    ): Promise<CartItem> {
        return this.cartItemService.addItem(userId, productId, quantity);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove an item from the cart' })
    @ApiResponse({ status: 204, description: 'Item removed from the cart' })
    @ApiParam({ name: 'id', description: 'ID of the cart item to remove' })
    async removeItem(@Param('id') id: number): Promise<void> {
        await this.cartItemService.removeItem(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update the quantity of an item in the cart' })
    @ApiResponse({ status: 200, description: 'Item quantity updated', type: CartItemDto })
    @ApiParam({ name: 'id', description: 'ID of the cart item to update' })
    @ApiBody({ type: CartItemDto, description: 'Updated quantity for the cart item' })
    async updateQuantity(
        @Param('id') id: number,
        @Body('quantity') quantity: number,
    ): Promise<CartItem> {
        return this.cartItemService.updateQuantity(id, quantity);
    }

    @Get(':userId')
    @ApiOperation({ summary: 'Get all items in the cart for a user' })
    @ApiResponse({ status: 200, description: 'List of cart items', type: [CartItemDto] })
    @ApiParam({ name: 'userId', description: 'ID of the user whose cart items are to be retrieved' })
    async getCartItems(@Param('userId') userId: number): Promise<CartItem[]> {
        const items = await this.cartItemService.getCartItems(userId);
        if (!items) {
            throw new NotFoundException(`Cart items for user with ID ${userId} not found`);
        }
        return items;
    }
}
