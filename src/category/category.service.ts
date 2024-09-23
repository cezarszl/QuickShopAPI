import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllCategories() {
        return this.prisma.category.findMany();
    }

    async createCategory(data: Prisma.CategoryCreateInput) {
        return this.prisma.category.create({
            data
        });
    }

    async updateCategory(id: number, data: Prisma.CategoryUpdateInput) {
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }

    async deleteCategory(id: number) {
        return this.prisma.category.delete(
            { where: { id } });
    }
}

