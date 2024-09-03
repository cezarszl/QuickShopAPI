import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CartItem } from '@prisma/client';

@Injectable()
export class CartItemService {
    constructor(private readonly prisma: PrismaService) { }

    async addItem(userId: number, productId: number, quantity: number): Promise<CartItem> {
        return this.prisma.cartItem.create({
            data: {
                userId,
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

    async getCartItems(userId: number): Promise<CartItem[]> {
        return await this.prisma.cartItem.findMany({
            where: { userId },
        });
    }
}
