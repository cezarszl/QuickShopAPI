import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(limit = 10, offset = 0): Promise<Product[]> {
        return this.prisma.product.findMany({
            skip: offset,
            take: limit,
        });
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    async create(data: {
        name: string;
        description: string;
        imageUrl: string;
        price: number;
    }): Promise<Product> {
        return this.prisma.product.create({
            data,
        });
    }

    async delete(id: number): Promise<void> {
        try {
            await this.prisma.product.delete({
                where: { id },
            });
        } catch (error) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }

    async update(id: number, data: {
        name?: string;
        description?: string;
        imageUrl?: string;
        price?: number;
    }): Promise<Product> {
        try {
            return await this.prisma.product.update({
                where: { id },
                data,
            });
        } catch (error) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }
}
