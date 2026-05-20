import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    // SQLite Veritabanı Bağlantı Ayarları
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'campusswap.sqlite', // Veritabanı dosyamızın adı
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Tabloları koddan okuyup otomatik oluşturur
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}