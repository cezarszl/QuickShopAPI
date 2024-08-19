import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create.user.dto';


@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async createUser(data: CreateUserDto): Promise<User> {

        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        })
        if (existingUser) {
            throw new ConflictException(`User with email ${data.email} already exists`);
        }
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
    async findUserByEmail(email: string): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new NotFoundException(`User with ID ${email} not found`);
        }
        return user;
    }

    async deleteUser(id: number): Promise<void> {
        try {
            await this.prisma.user.delete({
                where: { id },
            })
        } catch (error) {
            throw new NotFoundException(`User with ID ${id} not found`);
        };
    }
}
