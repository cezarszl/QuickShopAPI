import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreateCheckoutSessionDto } from './dto/create.payment.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('checkout-session')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a Stripe Checkout Session' })
    @ApiResponse({ status: 201, description: 'Stripe session created, returns session URL.' })
    @ApiResponse({ status: 401, description: 'Unauthorized - missing or invalid JWT.' })
    async createCheckoutSession(@Body() createPayment: CreateCheckoutSessionDto) {
        return this.paymentsService.createCheckoutSession(createPayment.cart, createPayment.customer);
    }
}
