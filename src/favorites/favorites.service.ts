import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FavoritesService {
    constructor(private readonly prisma: PrismaService) { }

    async getUserFavorites(userId: number) {
        return this.prisma.favorite.findMany({
            where: { userId },
            include: { product: true },
        });
    }

    async addFavorite(userId: number, productId: number) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product) throw new NotFoundException('Product not found');

        return this.prisma.favorite.create({
            data: { userId, productId },
        });
    }

    async removeFavorite(userId: number, productId: number) {
        return this.prisma.favorite.delete({
            where: { userId_productId: { userId, productId } },
        });
    }

    async isFavorite(userId: number, productId: number) {
        const fav = await this.prisma.favorite.findUnique({
            where: { userId_productId: { userId, productId } },
        });
        return !!fav;
    }
}
