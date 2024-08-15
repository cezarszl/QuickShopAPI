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
    }

    async findUserById(id: number): Promise<User> {
    }

    async deleteUser(id: number): Promise<User> {
    }

}

