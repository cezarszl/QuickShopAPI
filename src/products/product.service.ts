import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(filters: {
        category?: string;
        name?: string;
        minPrice?: number;
        maxPrice?: number;
        limit?: number;
        offset?: number;
    }): Promise<Product[]> {
        const { category, name, minPrice, maxPrice, limit, offset } = filters;

        const where: any = {};

        if (category)
            where.category = category;

        if (name) {
            where.name = {
                contains: name,
                mode: 'insensitive',
            };
        }

        if (minPrice !== undefined) {
            where.price = { ...where.price, gte: minPrice };
        }

        if (maxPrice !== undefined) {
            where.price = { ...where.price, lte: maxPrice };
        }

        return this.prisma.product.findMany({
            where,
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

    async create(createProductDto: CreateProductDto): Promise<Product> {
        return this.prisma.product.create({
            data: createProductDto
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

    async update(id: number, updateProductDto: UpdateProductDto
    ): Promise<Product> {
        try {
            return await this.prisma.product.update({
                where: { id },
                data: updateProductDto,
            });
        } catch (error) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }
}
