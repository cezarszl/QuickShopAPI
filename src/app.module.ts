import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductService } from './products/product.service';
import { ProductController } from './products/product.controller';
import { PrismaService } from './prisma.service';
import { UserService } from './users/user.service';
import { UserController } from './users/user.controller';
import { CartItemService } from './cart-items/cart-item.service';
import { CartItemController } from './cart-items/cart-item.controller';
import { AuthModule } from './auth/auth.module';
import { OrderController } from './orders/order.controller';
import { OrderService } from './orders/order.service';

@Module({
  imports: [AuthModule],
  controllers: [AppController, ProductController, UserController, CartItemController, OrderController],
  providers: [AppService, ProductService, PrismaService, UserService, CartItemService, OrderService],
})
export class AppModule { }
