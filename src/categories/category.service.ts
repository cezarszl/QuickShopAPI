import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllCategories() {
        return this.prisma.category.findMany();
    }

    async createCategory(data: CreateCategoryDto) {
        return this.prisma.category.create({
            data: {
                name: data.name,
            },
        });
    }

    async updateCategory(id: number, data: UpdateCategoryDto) {
        return this.prisma.category.update({
            where: { id },
            data: {
                name: data.name,
            },
        });
    }

    async deleteCategory(id: number) {
        return this.prisma.category.delete({
            where: { id },
        });
    }

    async getLowestPricesFromEachCategory(): Promise<{ categoryId: number, minPrice: number }[]> {
        const minPrices = await this.prisma.category.findMany({
            include: {
                products: {
                    select: {
                        price: true,
                    },
                    orderBy: { price: 'asc' },
                    take: 1,
                },
            },
        });

        return minPrices.map(category => ({
            categoryId: category.id,
            minPrice: category.products[0]?.price ?? 0,
        }));
    }

}
