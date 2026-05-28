import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path'; 
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // React'ın (Frontend) bu API'ye erişmesine izin ver
  app.enableCors();
  // Yüklenen resimlerin internetten erişilebilir olması için statik klasör tanımı
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
