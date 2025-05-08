import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service'
import { CreateOrderDto } from './dto/create.order.dto';
import { Order } from '@prisma/client';
import { UserService } from 'src/users/user.service';


@Injectable()
export class OrderService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService
    ) { }


    async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
        return await this.prisma.order.create({ data: createOrderDto, })
    }

    async getUserOrders(userId: number): Promise<Order[]> {
        await this.userService.checkIfUserExistsById(userId);

        return this.prisma.order.findMany({
            where: { userId }
        });
    }

    async getOrderById(id: number): Promise<Order> {
        const order = await this.prisma.order.findUnique({
            where: { id }
        });

        if (!order) {
            throw new NotFoundException(`Order with id ${id} not found.`);
        }

        return order;
    }
}
