import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Cart, CartItem, Prisma } from '@prisma/client';
import { CreateCartItemDto } from './dto/create.cart-item.dto';
import { CreateCartDto } from './dto/create.cart.dto';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }


    async addCart(createCartDto: CreateCartDto): Promise<Cart> {

        const { userId } = createCartDto;

        const cart = await this.prisma.cart.create({
            data: {
                userId,
            }
        });

        return cart;

    }
    
    async addItemToCart(createCartItemDto: CreateCartItemDto): Promise<CartItem> {
        const { cartId, productId, quantity } = createCartItemDto;

        const cart = await this.prisma.cart.findUnique({
            where: { id: cartId },
        });

        if (!cart) {
            throw new NotFoundException(`Cart with ID ${cartId} not found`);
        }

        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        const existingCartItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId,
                    productId,
                },
            },
        })

        if (existingCartItem) {
            const updatedCartItem = await this.prisma.cartItem.update({
                where: {
                    cartId_productId: {
                        cartId,
                        productId,
                    },
                },
                data: { quantity: existingCartItem.quantity + quantity },
            });

            return updatedCartItem;
        }

        const newCartItem = await this.prisma.cartItem.create({
            data: {
                cartId,
                productId,
                quantity,
            }
        })

        return newCartItem;
    }
    
}
