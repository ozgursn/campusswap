import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { User } from '../users/entities/user.entity'; // User entity'sini import ettik


@Module({
  imports: [TypeOrmModule.forFeature([Product, User])], // Buraya User'ı da ekledik!
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}