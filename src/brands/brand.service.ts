import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Brand } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateBrandDto } from './dto/create.brand.dto';

@Injectable()
export class BrandService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllBrands(): Promise<Brand[]> {
        return this.prisma.brand.findMany();
    }

    async getBrandById(id: number): Promise<Brand> {
        const brand = this.prisma.brand.findUnique({
            where: { id },
        });
        if (!brand) {
            throw new NotFoundException(`Brand with ID ${id} not found`);
        }
        return brand;
    }

    async addBrand(createBrandDto: CreateBrandDto): Promise<Brand> {
        return this.prisma.brand.create({
            data: createBrandDto,
        });
    }

    async delete(id: number): Promise<void> {
        try {
            await this.prisma.brand.delete({
                where: { id },
            });
        } catch (error) {
            throw new NotFoundException(`Brand with ID ${id} not found`);
        }
    }
}
