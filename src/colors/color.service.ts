import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Color } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateColorDto } from './dto/create.color.dto';

@Injectable()
export class ColorService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllColors(): Promise<Color[]> {
        return this.prisma.color.findMany();
    }

    async getColorById(id: number): Promise<Color> {
        const color = this.prisma.color.findUnique({
            where: { id },
        });
        if (!color) {
            throw new NotFoundException(`Color with ID ${id} not found`);
        }
        return color;
    }

    async addColor(createColorDto: CreateColorDto): Promise<Color> {

        const existingColor = await this.prisma.color.findUnique({
            where: { name: createColorDto.name },
        });

        if (existingColor) {
            throw new ConflictException('Color with this name already exists');
        }
        return this.prisma.color.create({
            data: createColorDto,
        });
    }

    async delete(id: number): Promise<void> {
        try {
            await this.prisma.color.delete({
                where: { id },
            });
        } catch (error) {
            throw new NotFoundException(`Color with ID ${id} not found`);
        }
    }
}
