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
import { PaymentsController } from './payments/payments.controller';
import { PaymentsService } from './payments/payments.service';
import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [AuthModule, ServeStaticModule.forRoot({
    rootPath: join(process.cwd(), 'assets', 'images'),
    serveRoot: '/images',
    serveStaticOptions: {
      index: false,
    },
  }),],
  controllers: [AppController, ProductController, UserController, CartItemController, OrderController, PaymentsController, CategoryController],
  providers: [AppService, ProductService, PrismaService, UserService, CartItemService, OrderService, PaymentsService, CategoryService],
})
export class AppModule { }
