import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CreatePaymentDto } from './dto/create.payment.dto';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2024-06-20',
        });
    }

    async createPayment(createPaymentDto: CreatePaymentDto) {
        const { amount, currency, source, description } = createPaymentDto;

        try {
            const payment = await this.stripe.charges.create({
                amount,
                currency,
                source,
                description,
            });
            return payment;
        } catch (error) {
            throw new Error(`Payment failed: ${error.message}`);
        }
    }
}
