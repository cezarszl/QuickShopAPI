import { Injectable } from '@nestjs/common';
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

    async findUserById(id: number): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async deleteUser(id: number): Promise<User> {
        return this.prisma.user.delete({
            where: { id },
        }

}

