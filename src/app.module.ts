import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductService } from './product/product.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ProductService],
})
export class AppModule {}
