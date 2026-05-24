import { Injectable, BadRequestException } from '@nestjs/common'; // BadRequestException burada tanımlı
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  // İlan oluşturma
  create(createProductDto: any) {
    const newProduct = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(newProduct);
  }

  // Tüm ilanları listeleme (Ana sayfa için)
  findAll() {
    return this.productsRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  // Tek bir ilanın detayını getirme (Güvenli - ParseIntPipe ile çalışır)
  findOne(id: number) {
    return this.productsRepository.findOneBy({ id });
  }

  // Belirli bir kullanıcının ilanlarını listeleme (Profil sayfası için)
  findByUser(userId: number) {
    return this.productsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  // GÜVENLİ SİLME MOTORU
  async remove(id: number, userId: number) {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new BadRequestException('İlan bulunamadı.');
    }

    // Yetki kontrolü: İlanın sahibi silmeye çalışan kişi mi?
    if (product.userId !== userId) {
      throw new BadRequestException('Bu ilanı silme yetkiniz yok! Güvenlik ihlali.');
    }

    await this.productsRepository.remove(product);
    return { success: true, message: 'İlan başarıyla kaldırıldı.' };
  }
}