import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path'; 
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🚀 CORS ENGELLENMESİNİ YOK EDEN O KRİTİK SATIR:
  // React (Frontend) ve Mobil cihazların bu API'ye sorunsuz erişmesini sağlar, tarayıcı engellerini kaldırır.
  app.enableCors();

  // 📦 GÖRSEL KORUMA: Yüklenen resimlerin hem telefonda hem webde hatasız açılması için statik klasör tanımı
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // 🌐 Sunucuyu tüm yerel ağa (0.0.0.0) ve 3000 portuna açıyoruz
  await app.listen(3000, '0.0.0.0');
  
  console.log(`\n🚀 [CAMPUSSWAP API] Sunucu başarıyla ayağa kalktı: http://localhost:3000`);
}
bootstrap();