import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not, IsNull, EntityManager } from 'typeorm'; 
import { Product } from './entities/product.entity';
import { User } from '../users/entities/user.entity'; 
import { Expo } from 'expo-server-sdk'; 
import * as admin from 'firebase-admin';
import { join } from 'path';

@Injectable()
export class ProductsService {
  private expo = new Expo();

  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

    private entityManager: EntityManager,
  ) {}

  // İlan oluşturma
  create(createProductDto: any) {
    const newProduct = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(newProduct);
  }

  // ⚡ Kurşun geçirmez sıralama için fonksiyon async yapıldı
  async findAll(search?: string, category?: string, campus?: string) {
    const findOptions: any = {
      // Temel sıralama olarak veritabanından en yenileri çekiyoruz
      order: { 
        createdAt: 'DESC'
      },
      relations: {
        user: true 
      }
    };

    const where: any = {};

    if (search && search !== 'undefined' && search !== 'null' && search.trim() !== '') {
      where.title = Like(`%${search}%`);
    }

    if (category && category !== 'Hepsi' && category !== 'undefined' && category !== 'null' && category.trim() !== '') {
      where.category = category;
    }

    if (campus && campus !== 'Hepsi' && campus !== 'undefined' && campus !== 'null' && campus.trim() !== '') {
      where.campus = campus;
    }

    if (Object.keys(where).length > 0) {
      findOptions.where = where;
    }

    try {
      // 1. Önce filtreye uyan tüm ürünleri veritabanından düz bir liste olarak çekiyoruz
      const products = await this.productsRepository.find(findOptions);

      // 2. 🚨 REAL-TIME BİLDİRİM GARANTİLİ JAVASCRIPT SIRALAMASI:
      // SQL'in Premium/Acil gruplama kısıtlamalarını tamamen eziyoruz.
      // Herhangi bir ürün acil satılık moduna geçtiği salisede listenin en tepesine (0. indekse) yerleşir!
      return products.sort((a, b) => {
        const aUrgent = a.isUrgent === true || String(a.isUrgent) === 'true' || Number(a.isUrgent) === 1;
        const bUrgent = b.isUrgent === true || String(b.isUrgent) === 'true' || Number(b.isUrgent) === 1;

        if (aUrgent && !bUrgent) return -1; // 'a' acil ise 'b'nin önüne geçsin
        if (!aUrgent && bUrgent) return 1;  // 'b' acil ise 'a'nın önüne geçsin
        
        // Eğer ikisi de acilse veya ikisi de normal ilansa, en büyük ID'li (en yeni) üstte gelsin
        return b.id - a.id;
      });

    } catch (error) {
      console.error("Ana sayfa ilanları çekilirken SQL hatası oluştu:", error);
      const fallbackProducts = await this.productsRepository.find({ order: { createdAt: 'DESC' }, relations: { user: true } });
      return fallbackProducts.sort((a, b) => {
        const aUrgent = a.isUrgent === true || String(a.isUrgent) === 'true';
        const bUrgent = b.isUrgent === true || String(b.isUrgent) === 'true';
        return (bUrgent ? 1 : 0) - (aUrgent ? 1 : 0);
      });
    }
  }

  findOne(id: number) {
    return this.productsRepository.findOne({
      where: { id },
      relations: {
        user: true 
      }
    });
  }

  findByUser(userId: number) {
    return this.productsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async remove(id: number, userId: number) {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new BadRequestException('İlan bulunamadı.');
    }

    if (product.userId !== userId) {
      throw new BadRequestException('Bu ilanı silme yetkiniz yok! Güvenlik ihlali.');
    }

    return this.productsRepository.remove(product);
  }

  async makePremium(id: number) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) throw new BadRequestException('İlan bulunamadı');
    
    product.isPremium = true;
    return this.productsRepository.save(product);
  }

  async makeUrgent(id: number) {
    const product = await this.productsRepository.findOne({ 
      where: { id }, 
      relations: { user: true } 
    });
    
    if (!product) {
      throw new NotFoundException('İlan bulunamadı.');
    }
    
    product.isUrgent = true;
    const updatedProduct = await this.productsRepository.save(product);
    
    await this.triggerCampusNotification(updatedProduct);
    
    return { 
      success: true, 
      message: 'İlan Acil Satılık moduna alındı, tüm kampüse bildirim gönderildi!', 
      product: updatedProduct 
    };
  }

  private async triggerCampusNotification(product: any) {
    console.log(`\n======================================================================`);
    console.log(`🚨 [CAMPUS PUSH NOTIFICATION] ⚡ ACİL İLAN ALARMI!`);
    console.log(` Satıcı: ${product.user?.name || 'Bir Öğrenci'}`);
    console.log(`📦 Ürün: ${product.title}`);
    console.log(`💰 Fiyat: ${product.price} ₺`);
    console.log(`📢 Durum: Kampüsteki tüm öğrencilere anlık bildirim fırlatıldı!`);
    console.log(`======================================================================\n`);

    try {
      const usersWithToken = await this.entityManager.getRepository(User).find({
        where: { pushToken: Not(IsNull()) },
      });

      const messages: any[] = [];
      for (const u of usersWithToken) {
        if (!Expo.isExpoPushToken(u.pushToken)) {
          continue;
        }

        messages.push({
          to: u.pushToken,
          sound: 'default',
          title: '🚨 KAMPÜSTE ACİL İLAN!',
          body: `"${product.title}" acil satılık durumuna alındı! Fiyat: ${product.price} TL. Kaçırmadan incele!`,
          data: { productId: product.id },
        });
      }

      if (messages.length > 0) {
        const chunks = this.expo.chunkPushNotifications(messages);
        for (const chunk of chunks) {
          await this.expo.sendPushNotificationsAsync(chunk);
        }
        console.log(`🚀 [SUCCESS] Arka planda ${messages.length} aktif öğrenci cihazına sinyal başarıyla uçuruldu.`);
      }

    } catch (error) {
      console.error('⚠️ Bildirim gönderim motoru arka planda hataya düştü:', error);
    }
  }
}