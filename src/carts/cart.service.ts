import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CartItem } from '@prisma/client';
import { CreateCartItemDto } from './dto/create.cart-item.dto';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }

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

    // async removeItem(id: number): Promise<void> {
    //     try {
    //         await this.prisma.cartItem.delete({
    //             where: { id },
    //         });
    //     } catch (error) {
    //         throw new NotFoundException(`CartItem with ID ${id} not found`);
    //     }
    // }

    // async clearCart(userId: number): Promise<void> {
    //     const user = await this.prisma.user.findUnique({ where: { id: userId } });

    //     if (!user) {
    //         throw new NotFoundException(`User with ID ${userId} not found`);
    //     }

    //     await this.prisma.cartItem.deleteMany({
    //         where: { userId: userId },
    //     })
    // }
    // async updateQuantity(id: number, quantity: number): Promise<CartItem> {
    //     try {
    //         return await this.prisma.cartItem.update({
    //             where: { id },
    //             data: { quantity },
    //         });
    //     } catch (error) {
    //         throw new NotFoundException(`CartItem with ID ${id} not found`);
    //     }
    // }

    // async getCartItemsByUserId(userId: number): Promise<CartItem[]> {
    //     return await this.prisma.cartItem.findMany({
    //         where: { userId },
    //     });
    // }
}
