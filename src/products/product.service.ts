import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';


@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) { }

    // Find all products based on filters
    async findAll(filters: {
        category?: number;
        name?: string;
        minPrice?: number;
        maxPrice?: number;
        limit?: number;
        offset?: number;
    }): Promise<Product[]> {
        const { category, name, minPrice, maxPrice, limit, offset } = filters;

        const where: any = {};

        if (category)
            where.categoryId = category;

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

    // Find specific product by id
    async findOne(id: number): Promise<Product> {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    // Create a product
    async create(createProductDto: CreateProductDto): Promise<Product> {
        return this.prisma.product.create({
            data: createProductDto
        });
    }

    // Delete a product by id
    async delete(id: number): Promise<void> {
        try {
            await this.prisma.product.delete({
                where: { id },
            });
        } catch (error) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }

    // Update a product by id
    async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
        try {
            return await this.prisma.product.update({
                where: { id },
                data: updateProductDto,
            });
        } catch (error) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }

    // Get random product from each category
    async getRandomProductsByCategory() {
        const categories = await this.prisma.category.findMany({
            include: { products: true },
        });

        const randomProducts = categories.map(category => {
            const products = category.products;
            if (products.length > 0) {
                const randomIndex = Math.floor(Math.random() * products.length);
                const randomProduct = products[randomIndex];
                return {
                    ...randomProduct,
                    categoryName: category.name
                };
            }
            return null;
        });

        return randomProducts.filter(product => product !== null);
    }
}
