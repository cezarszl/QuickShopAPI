import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';

type ProductWithCategoryName = Product & {
    categoryName?: string | null;
    category?: undefined
}

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) { }

    // Find all products based on filters
    async findAll(filters: {
        categoryId?: number;
        colorId?: number;
        brandIds?: number[];
        name?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: string;
        order?: string;
        limit?: number;
        offset?: number;
    }): Promise<{ products: Product[]; totalCount: number }> {

        const { categoryId, colorId, brandIds, name, minPrice, maxPrice, sortBy, order, limit, offset } = filters;

        const where: any = {};

        if (categoryId)
            where.categoryId = categoryId;

        if (colorId)
            where.colorId = colorId;

        if (brandIds && brandIds.length > 0) {
            where.brandId = { in: brandIds }
        }

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

        const orderBy: any = {};

        if (sortBy) {
            orderBy[sortBy] = order && order.toUpperCase() === 'DESC' ? 'desc' : 'asc';
        }

        const products = await this.prisma.product.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: sortBy ? orderBy : undefined,
        });

        const totalCount = await this.prisma.product.count({
            where,
        });

        return {
            products,
            totalCount,
        };
    }

    // Find specific product by id
    async findOne(id: number): Promise<ProductWithCategoryName> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { category: true }
        });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return {
            ...product,
            categoryName: product.category?.name || null,
            category: undefined
        };
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
    async getRandomProductsFromEachCategory(): Promise<ProductWithCategoryName[]> {
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
