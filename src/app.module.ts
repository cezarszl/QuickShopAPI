import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductService } from './products/product.service';
import { ProductController } from './products/product.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './users/user.service';
import { UserController } from './users/user.controller';
import { CartService } from './carts/cart.service';
import { CartController } from './carts/cart.controller';
import { AuthModule } from './auth/auth.module';
import { OrderController } from './orders/order.controller';
import { OrderService } from './orders/order.service';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsService } from './payments/payments.service';
import { CategoryService } from './categories/category.service';
import { CategoryController } from './categories/category.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BrandService } from './brands/brand.service';
import { BrandController } from './brands/brand.controller';
import { ColorService } from './colors/color.service';
import { ColorController } from './colors/color.controller';
import { DoesExistValidator } from './validators/does-exist.validator';
import { IsUniqueValidator } from './validators/is-unique.validator';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [AuthModule, ServeStaticModule.forRoot({
    rootPath: join(process.cwd(), 'assets', 'images'),
    serveRoot: '/images',
    serveStaticOptions: {
      index: false,
    },
  }), FavoritesModule,],
  controllers: [AppController, ProductController, UserController, CartController, OrderController, PaymentsController, CategoryController, BrandController, ColorController],
  providers: [AppService, ProductService, PrismaService, UserService, CartService, OrderService, PaymentsService, CategoryService, BrandService, ColorService, DoesExistValidator, IsUniqueValidator],
})
export class AppModule { }
