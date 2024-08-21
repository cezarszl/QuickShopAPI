import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create.user.dto';


@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async checkIfUserExists(email: string): Promise<void> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new ConflictException(`User with email ${email} already exists.`)
        }
    }
    async createUser(data: CreateUserDto): Promise<User> {

        await this.checkIfUserExists(data.email);
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
    async findUserByEmail(email: string): Promise<User | null> {
        return await this.prisma.user.findUnique({ where: { email } });
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
