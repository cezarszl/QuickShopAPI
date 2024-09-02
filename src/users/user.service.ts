import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';


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

    async updateUser(id: number, data: UpdateUserDto): Promise<User> {
        const user = await this.findUserById(id);

        if (user)
            return this.prisma.user.update({
                where: { id },
                data,
            });
    }

    async changePassword(id: number, changePasswordDto: ChangePasswordDto): Promise<User> {
        const { currentPassword, newPassword } = changePasswordDto;

        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found')
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new NotFoundException('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        return this.prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });
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

    async updateUserGoogleID(userId: number, googleId: string): Promise<User> {
        return this.prisma.user.update({
            where: { id: userId },
            data: { googleId }
        })
    }
}
