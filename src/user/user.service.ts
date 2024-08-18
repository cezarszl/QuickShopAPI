import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';


@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async createUser(data: {
        email: string;
        password: string;
        name: string;
    }): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }

    async findUserById(id: number): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async deleteUser(id: number): Promise<User> {
        try {
            return this.prisma.user.delete({
                where: { id },
            })
        } catch (error) {
            throw new NotFoundException(`User not found`);
        };
    }
}
