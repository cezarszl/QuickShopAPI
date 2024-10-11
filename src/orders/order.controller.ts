import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Order } from '@prisma/client';
import { CreateOrderDto } from './dto/create.order.dto';
import { OrderDto } from './dto/order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('orders')
@Controller('order')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OrderController {

    constructor(private readonly orderService: OrderService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponse({ status: 201, description: 'Order created successfully.', type: OrderDto })
    @ApiBody({ type: CreateOrderDto })
    async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
        return this.orderService.createOrder(createOrderDto);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Retrieve all orders for a specific user' })
    @ApiResponse({ status: 200, description: 'List of orders for the user.', type: [OrderDto] })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiParam({ name: 'userId', description: 'ID of the user whose orders are being retrieved' })
    async getUserOrders(@Param('userId', ParseIntPipe) userId: number): Promise<Order[]> {
        return this.orderService.getUserOrders(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get details of a specific order by its ID' })
    @ApiResponse({ status: 200, description: 'Details of the specified order.', type: OrderDto })
    @ApiResponse({ status: 404, description: 'Order not found.' })
    @ApiParam({ name: 'id', description: 'ID of the order' })
    async getOrderById(@Param('id', ParseIntPipe) id: number): Promise<Order> {
        return this.orderService.getOrderById(id);
    }

}
