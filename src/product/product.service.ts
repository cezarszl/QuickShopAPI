import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<Product[]> {
        return this.prisma.product.findMany();
    }

    async findOne(id: number): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: { id },
        });
    }

    async create(data: {
        name: string;
        description: string;
        imageUrl: string;
        price: number;
        ownerId?: number;
    }): Promise<Product> {
        return this.prisma.product.create({
            data,
        });
    }

    async update(id: number, data: {
        name?: string;
        description?: string;
        imageUrl?: string;
        price?: number;
    }): Promise<Product> {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<Product> {
        return this.prisma.product.delete({
            where: { id },
        });
    }
}
