import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity'; // Tablomuzu import ettik

@Module({
  // Tabloyu bu modüle bağladık
  imports: [TypeOrmModule.forFeature([Product])], 
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}