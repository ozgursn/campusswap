import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  // 1. Yeni İlan Oluşturma Fonksiyonu
 create(createProductDto: any) {
    // createProductDto içerisinden artık userId de gelecek
    const newProduct = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(newProduct);
  }
  // Belirli bir kullanıcının ilanlarını listeler
  findByUser(userId: number) {
    return this.productsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  // 2. Tüm İlanları Listeleme Fonksiyonu
  findAll() {
    return this.productsRepository.find({
      order: { createdAt: 'DESC' }, // En son eklenen ilanlar en üstte gelsin
    });
  }
  // 3. Tekil İlan Getirme Fonksiyonu
  findOne(id: number) {
    return this.productsRepository.findOneBy({ id });
  }
}