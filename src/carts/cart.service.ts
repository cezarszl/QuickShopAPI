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

    async updateCartItemQuantityByCartId(cartId: string, productId: number, patchCartItemDto: PatchCartItemDto): Promise<CartItem> {
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

    async updateCartItemQuantityByUserId(userId: number, productId: number, patchCartItemDto: PatchCartItemDto): Promise<CartItem> {
        const { quantity } = patchCartItemDto;

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

        const updatedCartItem = await this.prisma.cartItem.update({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId
                }
            },
            data: { quantity }
        });

        return updatedCartItem;
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
    }

    async mergeCarts(userId: number, anonymousCartId: string): Promise<boolean> {
        const [userCart, anonymousCart] = await this.prisma.$transaction([
            this.prisma.cart.findUnique({ where: { userId } }),
            this.prisma.cart.findUnique({ where: { id: anonymousCartId } }),
        ]);

        if (!anonymousCart) {
            throw new NotFoundException('Anonymous cart not found');
        }

        if (!userCart) {
            throw new NotFoundException('User cart not found');
        }

        const anonymousCartItems = await this.prisma.cartItem.findMany({
            where: { cartId: anonymousCart.id },
        });

        await this.prisma.$transaction(async (prisma) => {
            for (const item of anonymousCartItems) {
                const existingItem = await prisma.cartItem.findUnique({
                    where: {
                        cartId_productId: {
                            cartId: userCart.id,
                            productId: item.productId,
                        },
                    },
                });

                if (existingItem) {
                    await prisma.cartItem.update({
                        where: {
                            cartId_productId: {
                                cartId: userCart.id,
                                productId: item.productId,
                            },
                        },
                        data: {
                            quantity: existingItem.quantity + item.quantity,
                        },
                    });
                } else {
                    await prisma.cartItem.create({
                        data: {
                            cartId: userCart.id,
                            productId: item.productId,
                            quantity: item.quantity,
                        },
                    });
                }
            }

            await prisma.cartItem.deleteMany({ where: { cartId: anonymousCart.id } });
            await prisma.cart.delete({ where: { id: anonymousCart.id } });
        });

        return true;
    }

}
