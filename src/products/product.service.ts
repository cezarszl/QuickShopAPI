import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { ConfigService } from '@nestjs/config';

type ProductWithCategoryName = Product & {
    categoryName?: string | null;
    brandName?: string | null;
    colorName?: string | null;
    category?: undefined;
    brand?: undefined;
    color?: undefined;
};

@Injectable()
export class ProductService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService
    ) { }

    private prependBaseUrl(imageUrl: string): string {
        const baseUrl = this.configService.get<string>('BASE_URL') ?? '';
        return `${baseUrl}${new URL(imageUrl, 'http://dummy').pathname}`;
    }

    async findAll(filters: {
        categoryId?: number;
        categoryName?: string;
        colorId?: number;
        colorName?: string;
        brandIds?: number[];
        brandName?: string;
        name?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: string;
        order?: string;
        limit?: number;
        offset?: number;
    }): Promise<{ products: Product[]; totalCount: number }> {
        const {
            categoryId,
            categoryName,
            colorId,
            colorName,
            brandIds,
            brandName,
            name,
            minPrice,
            maxPrice,
            sortBy,
            order,
            limit,
            offset,
        } = filters;

        const where: Prisma.ProductWhereInput = {};

        if (categoryId) where.categoryId = categoryId;

        if (categoryName) {
            where.category = {
                name: {
                    equals: categoryName,
                    mode: 'insensitive',
                },
            };
        }

        if (colorId) where.colorId = colorId;

        if (colorName) {
            where.color = {
                name: {
                    equals: colorName,
                    mode: 'insensitive',
                },
            };
        }

        if (brandIds && brandIds.length > 0) {
            where.brandId = { in: brandIds };
        }

        if (brandName) {
            where.brand = {
                name: {
                    equals: brandName,
                    mode: 'insensitive',
                },
            };
        }

        if (name) {
            where.name = {
                contains: name,
                mode: 'insensitive',
            };
        }

        const price: Prisma.FloatFilter = {};
        if (minPrice !== undefined) price.gte = minPrice;
        if (maxPrice !== undefined) price.lte = maxPrice;
        if (Object.keys(price).length > 0) where.price = price;

        let orderBy: Prisma.ProductOrderByWithRelationInput | undefined = undefined;
        const allowedSortFields = ['price', 'name', 'createdAt', 'id'];
        if (sortBy && allowedSortFields.includes(sortBy)) {
            orderBy = {
                [sortBy]: order?.toUpperCase() === 'DESC' ? 'desc' : 'asc',
            } as Prisma.ProductOrderByWithRelationInput;
        }

        const take = limit ?? 20;
        const skip = offset ?? 0;

        const products = await this.prisma.product.findMany({
            where,
            skip,
            take,
            orderBy: sortBy ? orderBy : undefined,
        });

        const baseUrl = this.configService.get<string>('BASE_URL') ?? '';
        const processed = products.map(p => ({
            ...p,
            imageUrl: this.prependBaseUrl(p.imageUrl),
        }));

        const totalCount = await this.prisma.product.count({ where });

        return {
            products: processed,
            totalCount,
        };
    }

    async findOne(id: number): Promise<ProductWithCategoryName> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                brand: true,
                color: true,
            },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return {
            ...product,
            imageUrl: this.prependBaseUrl(product.imageUrl),
            categoryName: product.category?.name || null,
            brandName: product.brand?.name || null,
            colorName: product.color?.name || null,
            category: undefined,
            brand: undefined,
            color: undefined,
        };
    }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        return this.prisma.product.create({
            data: createProductDto,
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

    async getRandomProductsFromEachCategory(): Promise<ProductWithCategoryName[]> {
        const categories = await this.prisma.category.findMany({
            include: { products: true },
        });

        return categories
            .map(category => {
                const products = category.products;
                if (products.length > 0) {
                    const randomIndex = Math.floor(Math.random() * products.length);
                    const randomProduct = products[randomIndex];
                    return {
                        ...randomProduct,
                        imageUrl: this.prependBaseUrl(randomProduct.imageUrl),
                        categoryName: category.name,
                    };
                }
                return null;
            })
            .filter(product => product !== null);
    }

    async getNewProductsThisWeek(): Promise<Product[]> {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const products = await this.prisma.product.findMany({
            where: {
                createdAt: {
                    gte: oneWeekAgo,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return products.map(p => ({
            ...p,
            imageUrl: this.prependBaseUrl(p.imageUrl),
        }));
    }
}
