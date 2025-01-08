import { Controller, Post, Delete, Patch, Get, Param, Body, ParseIntPipe, HttpCode, UseGuards, HttpStatus, Headers, BadRequestException, Put, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/cart-item.dto';
import { CartDto } from './dto/cart.dto';
import { Cart, CartItem } from '@prisma/client';
import { CreateCartItemDto } from './dto/create.cart-item.dto';
import { PatchCartItemDto } from './dto/patch.cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCartDto } from './dto/create.cart.dto';
import { MergeCartDto } from './dto/merge.cart';
@ApiTags('carts')
@Controller()
export class CartController {
    constructor(private readonly cartService: CartService) { }


    // POST /carts
    @Post('carts')
    @ApiOperation({ summary: 'Create a new cart' })
    @ApiResponse({
        status: 201,
        description: 'Cart created successfully',
        type: CartDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request: Validation failed for provided data.'
    })
    @ApiBody({ type: CreateCartDto })
    async addCart(@Body() createCartDto: CreateCartDto): Promise<Cart> {
        return this.cartService.addCart(createCartDto);
    }


    // POST /carts/items
    @Post('carts/items')
    @ApiOperation({ summary: 'Add an item to the cart' })
    @ApiResponse({
        status: 201,
        description: 'Item added to the cart successfully',
        type: CartItemDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Cart not found for the provided cartId.',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request: Validation failed for provided data.',
    })
    @ApiBody({ type: CreateCartItemDto })
    async addItemToCart(
        @Body() createCartItemDto: CreateCartItemDto
    ): Promise<CartItemDto> {
        return this.cartService.addItemToCart(createCartItemDto);
    }


    // GET /carts/{cartId}
    @Get('carts/:cartId')
    @ApiOperation({ summary: 'Get all items in the cart by cartId' })
    @ApiResponse({ status: 200, description: 'List of cart items', type: [CartItemDto] })
    @ApiResponse({ status: 404, description: 'Cart not found for the given cartId.' })
    @ApiResponse({ status: 400, description: 'Bad request: cartId is missing.' })
    @ApiParam({ name: 'cartId', description: 'ID of the cart (for anonymous users, usually from cookies)' })
    async getCartItemsByCartId(@Param('cartId') cartId: string): Promise<CartItem[]> {
        if (!cartId) {
            throw new BadRequestException('cartId is required');
        }
        return await this.cartService.getCartItemsByCartId(cartId);
    }


    // GET /users/{userId}/cart
    @Get('users/:userId/cart')
    @ApiOperation({ summary: 'Get all items in the cart by userId' })
    @ApiResponse({ status: 200, description: 'List of cart items', type: [CartItemDto] })
    @ApiResponse({ status: 404, description: 'Cart not found for the given userId.' })
    @ApiResponse({ status: 400, description: 'Bad request: userId is missing.' })
    @ApiParam({ name: 'userId', description: 'ID of the user (for logged-in users)' })
    async getCartItemsByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<CartItem[]> {
        if (!userId) {
            throw new BadRequestException('userId is required');
        }
        return await this.cartService.getCartItemsByUserId(userId);
    }

    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // PATCH /carts/:cartId/items/:productId
    @Patch('carts/:cartId/items/:productId')
    @ApiOperation({ summary: 'Update the quantity of an item in the cart' })
    @ApiResponse({ status: 200, description: 'Cart item updated successfully', type: CartItemDto })
    @ApiResponse({ status: 404, description: 'Cart item not found' })
    @ApiParam({ name: 'cartId', description: 'ID of the cart' })
    @ApiParam({ name: 'productId', description: 'ID of the product' })
    @ApiBody({ type: PatchCartItemDto })
    async updateCartItemByCartId(
        @Param('cartId') cartId: string,
        @Param('productId', ParseIntPipe) productId: number,
        @Body() updateCartItemDto: PatchCartItemDto,
    ): Promise<CartItemDto> {
        return this.cartService.updateCartItemQuantityByCartId(cartId, productId, updateCartItemDto);
    }

    // PATCH /users/:userId/cart/items/:productId
    @Patch('users/:userId/cart/items/:productId')
    @ApiOperation({ summary: 'Update the quantity of an item in the user cart' })
    @ApiResponse({
        status: 200,
        description: 'Cart item updated successfully',
        type: CartItemDto
    })
    @ApiResponse({
        status: 404,
        description: 'Cart or cart item not found'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request: Validation failed for provided data.'
    })
    @ApiParam({ name: 'userId', description: 'ID of the user' })
    @ApiParam({ name: 'productId', description: 'ID of the product' })
    @ApiBody({ type: PatchCartItemDto })
    async updateCartItemByUserId(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('productId', ParseIntPipe) productId: number,
        @Body() updateCartItemDto: PatchCartItemDto,
    ): Promise<CartItemDto> {
        return this.cartService.updateCartItemQuantityByUserId(userId, productId, updateCartItemDto);
    }

    // DELETE /carts/:cartId/items/:productId
    @Delete('carts/:cartId/items/:productId')
    @ApiOperation({ summary: 'Remove an item from the cart' })
    @ApiResponse({ status: 200, description: 'Cart item removed successfully' })
    @ApiResponse({ status: 404, description: 'Cart item not found' })
    @ApiParam({ name: 'cartId', description: 'ID of the cart' })
    @ApiParam({ name: 'productId', description: 'ID of the product' })
    async removeCartItemByCartId(
        @Param('cartId') cartId: string,
        @Param('productId') productId: number,
    ): Promise<void> {
        return this.cartService.removeCartItemByCartId(cartId, productId);
    }

    // DELETE /users/:userId/cart/items/:productId
    @Delete('users/:userId/cart/items/:productId')
    @ApiOperation({ summary: 'Remove an item from user cart' })
    @ApiResponse({ status: 200, description: 'Cart item removed successfully' })
    @ApiResponse({ status: 404, description: 'Cart or cart item not found' })
    @ApiParam({ name: 'userId', description: 'ID of the user' })
    @ApiParam({ name: 'productId', description: 'ID of the product' })
    async removeCartItemByUserId(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('productId', ParseIntPipe) productId: number,
    ): Promise<void> {
        return this.cartService.removeCartItemByUserId(userId, productId);
    }

    // DELETE /users/:userId/cart/clear
    @Delete('users/:userId/cart/clear')
    @ApiOperation({ summary: 'Clear logged user cart' })
    @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
    @ApiResponse({ status: 404, description: 'User cart not found' })
    @ApiParam({ name: 'userId', description: 'ID of the user' })
    async clearUserCart(
        @Param('userId', ParseIntPipe) userId: number
    ): Promise<void> {
        return this.cartService.clearCartByUserId(userId);
    }

    // DELETE /carts/:cartId/clear
    @Delete('carts/:cartId/clear')
    @ApiOperation({ summary: 'Clear anonymous cart' })
    @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
    @ApiResponse({ status: 404, description: 'Cart not found' })
    @ApiParam({ name: 'cartId', description: 'ID of the cart' })
    async clearAnonymousCart(
        @Param('cartId') cartId: string
    ): Promise<void> {
        return this.cartService.clearCartByCartId(cartId);
    }

    // PUT /carts/merge
    @Put('/carts/merge')
    @ApiOperation({ summary: 'Merge anonymous cart with user cart' })
    @ApiResponse({ status: 200, description: 'Carts merged successfully' })
    @ApiResponse({ status: 400, description: 'Invalid data provided' })
    @ApiBody({
        description: 'Data for merging carts',
        type: MergeCartDto,
    })
    async mergeCarts(@Body() mergeCartDto: MergeCartDto): Promise<void> {
        const { anonymousCartId, userId } = mergeCartDto;

        if (!anonymousCartId || !userId) {
            throw new BadRequestException(
                'anonymousCartId and userId are required for merging carts',
            );
        }

        const result = await this.cartService.mergeCarts(userId, anonymousCartId);

        if (!result) {
            throw new NotFoundException('Unable to merge carts');
        }
    }
}

