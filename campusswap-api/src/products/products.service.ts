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
  create(createProductDto: CreateProductDto) {
    // Gelen veriden yeni bir ürün objesi yarat
    const newProduct = this.productsRepository.create(createProductDto);
    // Veritabanına kaydet
    return this.productsRepository.save(newProduct);
  }

  // 2. Tüm İlanları Listeleme Fonksiyonu
  findAll() {
    return this.productsRepository.find({
      order: { createdAt: 'DESC' }, // En son eklenen ilanlar en üstte gelsin
    });
  }
}