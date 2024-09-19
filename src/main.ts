import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('QuickShop API')
    .setDescription('REST Api')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(passport.initialize());
  app.useGlobalPipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true, whitelist: true }))
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
