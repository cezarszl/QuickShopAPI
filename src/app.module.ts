import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { PrismaService } from './prisma.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { CartItemService } from './cart-item/cart-item.service';
import { CartItemController } from './cart-item/cart-item.controller';

@Module({
  imports: [],
  controllers: [AppController, ProductController, UserController, CartItemController],
  providers: [AppService, ProductService, PrismaService, UserService, CartItemService],
})
export class AppModule { }
