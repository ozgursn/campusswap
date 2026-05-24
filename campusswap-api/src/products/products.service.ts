import { Injectable, BadRequestException } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm'; // <-- Like fonksiyonunu buraya ekledik!
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

  // B MADDESİ: PREMIUM SIRALAMALI VE FİLTRELİ YENİ FINDALL FONKSİYONU
  findAll(search?: string, category?: string, campus?: string) {
    const findOptions: any = {
      // 1. ÖNCE PREMIUM OLANLAR BAŞA GELİR (DESC), SONRA KENDİ İÇİNDE EN YENİLER LİSTELENİR
      order: { 
        isPremium: 'DESC',
        createdAt: 'DESC' 
      },
      relations: {
        user: true // Ana sayfada ilan kartlarında satıcı ismi gözüksün diye ekledik
      }
    };

    // Dinamik filtre nesnesi (Arama motoru için)
    const where: any = {};

    // Kelime arama filtresi
    if (search) {
      where.title = Like(`%${search}%`);
    }

    // Kategori filtresi
    if (category && category !== 'Hepsi') {
      where.category = category;
    }

    // Kampüs filtresi
    if (campus && campus !== 'Hepsi') {
      where.campus = campus;
    }

    // Eğer herhangi bir filtre girildiyse seçeneklere ekle
    if (Object.keys(where).length > 0) {
      findOptions.where = where;
    }

    return this.productsRepository.find(findOptions);
  }

  findOne(id: number) {
    return this.productsRepository.findOne({
      where: { id },
      relations: {
        user: true 
      }
    });
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

    if (product.userId !== userId) {
      throw new BadRequestException('Bu ilanı silme yetkiniz yok! Güvenlik ihlali.');
    }

    await this.productsRepository.remove(product);
    return { success: true, message: 'İlan başarıyla kaldırıldı.' };
  }

  async makePremium(id: number) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) throw new BadRequestException('İlan bulunamadı');
    
    product.isPremium = true;
    return this.productsRepository.save(product);
  }
}