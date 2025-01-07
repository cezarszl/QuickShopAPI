import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CartItem } from '@prisma/client';

@Injectable()
export class CartItemService {
    constructor(private readonly prisma: PrismaService) { }

    async addItem(cartId: string | null, userId: number, productId: number, quantity: number): Promise<CartItem> {

        if (!cartId && !userId) {
            throw new Error('Either card or userId must be provided');
        }

        // Check if product exist in cart
        const existingCartItem = await this.prisma.cartItem.findFirst({
            where: {
                productId,
                ...(userId ? { userId } : { cartId }),
            },
        });

        if (existingCartItem) {
            return this.prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + quantity }
            })
        }

        return this.prisma.cartItem.create({
            data: {
                userId,
                cartId,
                productId,
                quantity,
            },
        });
    }

    async removeItem(id: number): Promise<void> {
        try {
            await this.prisma.cartItem.delete({
                where: { id },
            });
        } catch (error) {
            throw new NotFoundException(`CartItem with ID ${id} not found`);
        }
    }

    async clearCart(userId: number): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        await this.prisma.cartItem.deleteMany({
            where: { userId: userId },
        })
    }
    async updateQuantity(id: number, quantity: number): Promise<CartItem> {
        try {
            return await this.prisma.cartItem.update({
                where: { id },
                data: { quantity },
            });
        } catch (error) {
            throw new NotFoundException(`CartItem with ID ${id} not found`);
        }
    }

    async getCartItemsByUserId(userId: number): Promise<CartItem[]> {
        return await this.prisma.cartItem.findMany({
            where: { userId },
        });
    }
}
