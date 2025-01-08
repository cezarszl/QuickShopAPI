import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Cart, CartItem, Prisma } from '@prisma/client';
import { CreateCartItemDto } from './dto/create.cart-item.dto';
import { CreateCartDto } from './dto/create.cart.dto';
import { PatchCartItemDto } from './dto/patch.cart-item.dto';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }


    async addCart(createCartDto: CreateCartDto): Promise<Cart> {

        const { userId } = createCartDto;

        const cart = await this.prisma.cart.create({
            data: {
                userId,
            }
        });

        return cart;

    }

    async addItemToCart(createCartItemDto: CreateCartItemDto): Promise<CartItem> {
        const { cartId, productId, quantity } = createCartItemDto;

        const cart = await this.prisma.cart.findUnique({
            where: { id: cartId },
        });

        if (!cart) {
            throw new NotFoundException(`Cart with ID ${cartId} not found`);
        }

        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        const existingCartItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId,
                    productId,
                },
            },
        })

        if (existingCartItem) {
            const updatedCartItem = await this.prisma.cartItem.update({
                where: {
                    cartId_productId: {
                        cartId,
                        productId,
                    },
                },
                data: { quantity: existingCartItem.quantity + quantity },
            });

            return updatedCartItem;
        }

        const newCartItem = await this.prisma.cartItem.create({
            data: {
                cartId,
                productId,
                quantity,
            }
        })

        return newCartItem;
    }

    async getCartItemsByCartId(cartId: string): Promise<CartItem[]> {
        const cartItems = await this.prisma.cartItem.findMany({
            where: { cartId },
        });

        if (!cartItems.length) {
            throw new NotFoundException(`No cart items found for cartId: ${cartId}`);
        }

        return cartItems;
    }

    async getCartItemsByUserId(userId: number): Promise<CartItem[]> {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
        });

        const cartItems = await this.prisma.cartItem.findMany({
            where: { cartId: cart.id },
        });

        if (!cartItems.length) {
            throw new NotFoundException(`No cart items found for userId: ${userId}`);
        }

        return cartItems;
    }

    async updateCartItemQuantity(cartId: string, productId: number, patchCartItemDto: PatchCartItemDto): Promise<CartItem> {
        const { quantity } = patchCartItemDto;

        const cartItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId,
                    productId
                }
            }
        })

        if (!cartItem) {
            throw new NotFoundException(`Cart item with cartId ${cartId} and productId ${productId} not found`)
        }

        const updatedCartItem = await this.prisma.cartItem.update({
            where: {
                cartId_productId: {
                    cartId,
                    productId
                }
            },
            data: { quantity }
        })
        return updatedCartItem;
    }
}
