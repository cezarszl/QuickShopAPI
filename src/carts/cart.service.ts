import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cart, CartItem, Prisma } from '@prisma/client';
import { CreateCartItemDto } from './dto/create.cart-item.dto';
import { CreateCartDto } from './dto/create.cart.dto';
import { PatchCartItemDto } from './dto/patch.cart-item.dto';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }


    async addCart(createCartDto: CreateCartDto): Promise<Cart> {

        const { userId } = createCartDto;

        if (userId) {
            const existingCart = await this.prisma.cart.findFirst({
                where: { userId },
            });

            if (existingCart) return existingCart;
        }

        const cart = await this.prisma.cart.create({
            data: {
                userId,
            }
        });

        return cart;

    }

    async addItemToCart(createCartItemDto: CreateCartItemDto): Promise<CartItem> {
        const { cartId, productId, quantity } = createCartItemDto;

        await this.getCartOrThrow(cartId);

        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        return this.prisma.cartItem.upsert({
            where: {
                cartId_productId: { cartId, productId }
            },
            update: {
                quantity: { increment: quantity }
            },
            create: {
                cartId,
                productId,
                quantity
            }
        });
    }

    async getCartItemsByCartId(cartId: string): Promise<CartItem[]> {
        const cartItems = await this.prisma.cartItem.findMany({
            where: { cartId },
            orderBy: {
                createdAt: 'asc'
            }
        });

        if (!cartItems.length) {
            throw new NotFoundException(`No cart items found for cartId: ${cartId}`);
        }

        return cartItems;
    }

    async getCartItemsByUserId(userId: number): Promise<CartItem[]> {
        const cart = await this.getUserCartOrThrow(userId);

        const cartItems = await this.prisma.cartItem.findMany({
            where: { cartId: cart.id },
            orderBy: {
                createdAt: 'asc'
            }
        });

        if (!cartItems.length) {
            throw new NotFoundException(`No cart items found for userId: ${userId}`);
        }

        return cartItems;
    }

    async updateCartItemQuantityByCartId(
        cartId: string,
        productId: number,
        patchCartItemDto: PatchCartItemDto
    ): Promise<CartItem> {
        await this.getCartOrThrow(cartId);
        return this.updateCartItemQuantity(cartId, productId, patchCartItemDto.quantity);
    }

    async updateCartItemQuantityByUserId(
        userId: number,
        productId: number,
        patchCartItemDto: PatchCartItemDto
    ): Promise<CartItem> {
        const cart = await this.getUserCartOrThrow(userId);
        return this.updateCartItemQuantity(cart.id, productId, patchCartItemDto.quantity);
    }

    async removeCartItemByCartId(cartId: string, productId: number): Promise<void> {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId,
                    productId,
                },
            },
        });

        if (!cartItem) {
            throw new NotFoundException(
                `Cart item with cartId ${cartId} and productId ${productId} not found`
            );
        }

        await this.prisma.cartItem.delete({
            where: {
                cartId_productId: {
                    cartId,
                    productId,
                },
            },
        });
    }

    async removeCartItemByUserId(userId: number, productId: number): Promise<void> {
        const cart = await this.prisma.cart.findFirst({
            where: { userId }
        });

        if (!cart) {
            throw new NotFoundException(`Cart for user ${userId} not found`);
        }

        const cartItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId
                }
            }
        });

        if (!cartItem) {
            throw new NotFoundException(`Cart item with productId ${productId} not found in user's ${userId} cart`);
        }

        await this.prisma.cartItem.delete({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId
                }
            }
        });
    }

    async clearCartByUserId(userId: number): Promise<void> {
        const cart = await this.prisma.cart.findFirst({
            where: { userId }
        });

        if (!cart) {
            throw new NotFoundException(`Cart for user ${userId} not found`);
        }

        await this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });
    }

    async clearCartByCartId(cartId: string): Promise<void> {
        const cart = await this.prisma.cart.findUnique({
            where: { id: cartId }
        });

        if (!cart) {
            throw new NotFoundException(`Cart ${cartId} not found`);
        }

        await this.prisma.cartItem.deleteMany({
            where: { cartId }
        });

        await this.prisma.cart.delete({
            where: { id: cartId },
        })
    }

    async mergeCarts(userId: number, anonymousCartId: string): Promise<boolean> {
        let userCart = await this.prisma.cart.findUnique({ where: { userId } });
        const anonymousCart = await this.prisma.cart.findUnique({ where: { id: anonymousCartId } });


        if (!anonymousCart) {
            throw new NotFoundException('Anonymous cart not found');
        }

        if (!userCart) {
            userCart = await this.prisma.cart.create({
                data: { userId },
            });
        }

        const anonymousCartItems = await this.prisma.cartItem.findMany({
            where: { cartId: anonymousCart.id },
        });

        await this.prisma.$transaction(async (prisma) => {
            for (const item of anonymousCartItems) {
                await prisma.cartItem.upsert({
                    where: {
                        cartId_productId: {
                            cartId: userCart.id,
                            productId: item.productId,
                        },
                    },
                    update: {
                        quantity: {
                            increment: item.quantity
                        }
                    },
                    create: {
                        cartId: userCart.id,
                        productId: item.productId,
                        quantity: item.quantity,
                    },
                });
            }

            await prisma.cartItem.deleteMany({ where: { cartId: anonymousCart.id } });
            const stillExists = await prisma.cart.findUnique({
                where: { id: anonymousCart.id },
            });

            if (stillExists) {
                await prisma.cart.delete({
                    where: { id: anonymousCart.id },
                });
            }
        });

        return true;
    }


    private async getCartOrThrow(cartId: string): Promise<Cart> {
        const cart = await this.prisma.cart.findUnique({
            where: { id: cartId }
        });

        if (!cart) {
            throw new NotFoundException(`Cart ${cartId} not found`);
        }

        return cart;
    }

    private async getUserCartOrThrow(userId: number): Promise<Cart> {
        const cart = await this.prisma.cart.findFirst({
            where: { userId }
        });

        if (!cart) {
            throw new NotFoundException(`Cart for user ${userId} not found`);
        }

        return cart;
    }

    private async updateCartItemQuantity(
        cartId: string,
        productId: number,
        quantity: number
    ): Promise<CartItem> {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: { cartId, productId }
            }
        });

        if (!cartItem) {
            throw new NotFoundException(`Cart item not found`);
        }

        return this.prisma.cartItem.update({
            where: {
                cartId_productId: { cartId, productId }
            },
            data: { quantity }
        });
    }
}
