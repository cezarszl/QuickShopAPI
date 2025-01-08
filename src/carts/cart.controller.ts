import { Controller, Post, Delete, Patch, Get, Param, Body, ParseIntPipe, UseGuards, BadRequestException, Put, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/cart-item.dto';
import { CartDto } from './dto/cart.dto';
import { Cart, CartItem } from '@prisma/client';
import { CreateCartItemDto } from './dto/create.cart-item.dto';
import { PatchCartItemDto } from './dto/patch.cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCartDto } from './dto/create.cart.dto';
import { MergeCartDto } from './dto/merge.cart';

@Controller()
@ApiTags('carts')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    // Anonymous Cart Operations
    @Post('carts')
    @ApiOperation({ summary: 'Create a new anonymous cart' })
    @ApiResponse({ status: 201, description: 'Cart created successfully', type: CartDto })
    @ApiResponse({ status: 400, description: 'Invalid data provided' })
    @ApiBody({ type: CreateCartDto })
    async createAnonymousCart(@Body() createCartDto: CreateCartDto): Promise<Cart> {
        return this.cartService.addCart(createCartDto);
    }

    @Get('carts/:cartId')
    @ApiOperation({ summary: 'Get anonymous cart items' })
    @ApiResponse({ status: 200, description: 'Cart items retrieved successfully', type: [CartItemDto] })
    @ApiResponse({ status: 404, description: 'Cart not found' })
    @ApiParam({ name: 'cartId', description: 'Anonymous cart ID' })
    async getAnonymousCartItems(@Param('cartId') cartId: string): Promise<CartItem[]> {
        return this.cartService.getCartItemsByCartId(cartId);
    }

    @Post('carts/items')
    @ApiOperation({ summary: 'Add item to anonymous cart' })
    @ApiResponse({ status: 201, description: 'Item added successfully', type: CartItemDto })
    @ApiResponse({ status: 404, description: 'Cart not found' })
    @ApiBody({ type: CreateCartItemDto })
    async addAnonymousCartItem(
        @Body() createCartItemDto: CreateCartItemDto
    ): Promise<CartItemDto> {
        return this.cartService.addItemToCart(createCartItemDto);
    }

    @Patch('carts/:cartId/items/:productId')
    @ApiOperation({ summary: 'Update anonymous cart item quantity' })
    @ApiResponse({ status: 200, description: 'Item updated successfully', type: CartItemDto })
    @ApiResponse({ status: 404, description: 'Item not found' })
    @ApiBody({
        type: PatchCartItemDto,
        description: 'Data for updating cart item quantity'
    })
    async updateAnonymousCartItem(
        @Param('cartId') cartId: string,
        @Param('productId', ParseIntPipe) productId: number,
        @Body() updateCartItemDto: PatchCartItemDto,
    ): Promise<CartItemDto> {
        return this.cartService.updateCartItemQuantityByCartId(cartId, productId, updateCartItemDto);
    }

    @Delete('carts/:cartId/items/:productId')
    @ApiOperation({ summary: 'Remove item from anonymous cart' })
    @ApiResponse({ status: 204, description: 'Item removed successfully' })
    @ApiResponse({ status: 404, description: 'Item not found' })
    async removeAnonymousCartItem(
        @Param('cartId') cartId: string,
        @Param('productId', ParseIntPipe) productId: number,
    ): Promise<void> {
        return this.cartService.removeCartItemByCartId(cartId, productId);
    }

    @Delete('carts/:cartId/clear')
    @ApiOperation({ summary: 'Clear anonymous cart' })
    @ApiResponse({ status: 204, description: 'Cart cleared successfully' })
    @ApiResponse({ status: 404, description: 'Cart not found' })
    async clearAnonymousCart(@Param('cartId') cartId: string): Promise<void> {
        return this.cartService.clearCartByCartId(cartId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put('carts/merge')
    @ApiOperation({ summary: 'Merge anonymous cart with user cart' })
    @ApiResponse({ status: 200, description: 'Carts merged successfully' })
    @ApiResponse({ status: 404, description: 'Cart not found' })
    @ApiResponse({ status: 400, description: 'Invalid data provided' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiBody({ type: MergeCartDto })
    async mergeCarts(@Body() { userId, anonymousCartId }: MergeCartDto): Promise<void> {
        const result = await this.cartService.mergeCarts(userId, anonymousCartId);
        if (!result) {
            throw new NotFoundException('Failed to merge carts');
        }
    }

    // User Cart Operations
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('users/:userId/cart')
    @ApiOperation({ summary: 'Get user cart items' })
    @ApiResponse({ status: 200, description: 'Cart items retrieved successfully', type: [CartItemDto] })
    @ApiResponse({ status: 404, description: 'Cart not found' })
    @ApiResponse({ status: 400, description: 'Invalid data provided' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async getUserCartItems(@Param('userId', ParseIntPipe) userId: number): Promise<CartItem[]> {
        return this.cartService.getCartItemsByUserId(userId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch('users/:userId/cart/items/:productId')
    @ApiOperation({ summary: 'Update user cart item quantity' })
    @ApiResponse({ status: 200, description: 'Item updated successfully', type: CartItemDto })
    @ApiResponse({ status: 404, description: 'Item not found' })
    @ApiResponse({ status: 400, description: 'Invalid data provided' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiBody({
        type: PatchCartItemDto,
        description: 'Data for updating cart item quantity'
    })
    async updateUserCartItem(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('productId', ParseIntPipe) productId: number,
        @Body() updateCartItemDto: PatchCartItemDto,
    ): Promise<CartItemDto> {
        return this.cartService.updateCartItemQuantityByUserId(userId, productId, updateCartItemDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete('users/:userId/cart/items/:productId')
    @ApiOperation({ summary: 'Remove item from user cart' })
    @ApiResponse({ status: 204, description: 'Item removed successfully' })
    @ApiResponse({ status: 404, description: 'Item not found' })
    @ApiResponse({ status: 400, description: 'Invalid data provided' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async removeUserCartItem(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('productId', ParseIntPipe) productId: number,
    ): Promise<void> {
        return this.cartService.removeCartItemByUserId(userId, productId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete('users/:userId/cart/clear')
    @ApiOperation({ summary: 'Clear user cart' })
    @ApiResponse({ status: 204, description: 'Cart cleared successfully' })
    @ApiResponse({ status: 404, description: 'Cart not found' })
    @ApiResponse({ status: 400, description: 'Invalid data provided' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async clearUserCart(@Param('userId', ParseIntPipe) userId: number): Promise<void> {
        return this.cartService.clearCartByUserId(userId);
    }
}