import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile, Patch, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Fotoğraflı Yeni İlan Verme Uç Noktası
  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads', // Dosyaların kaydedileceği klasör
      filename: (req, file, callback) => {
        // Resim isimlerinin çakışmaması için benzersiz bir isim üretiyoruz (Örn: ad-123456.jpg)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    })
  }))
  create(@Body() createProductDto: any, @UploadedFile() file: Express.Multer.File) {
    // Eğer kullanıcı bir fotoğraf yüklediyse, bunun internet yolunu veritabanına kaydedelim
    if (file) {
      createProductDto.imageUrl = `http://localhost:3000/uploads/${file.filename}`;
    }
    return this.productsService.create(createProductDto);
  }

// 🚨 KİLİT DEĞİŞİKLİK: URL'den gelen query parametrelerini @Query ile yakalıyoruz
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('campus') campus?: string,
  ) {
    // Yakaladığımız arama kelimesini, kategori ve kampüsü servisteki canavar filtreye fırlatıyoruz
    return this.productsService.findAll(search, category, campus);
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.productsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Body('userId', ParseIntPipe) userId: number) {
    return this.productsService.remove(id, userId);
  }

 // products.controller.ts dosyasının en alt satırları

  @Patch(':id/premium')
  makePremium(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.makePremium(id);
  }

  // 🚀 404 HATASINI ÇÖZEN GÜNCEL METOT:
  // ParseIntPipe ekleyerek gelen ID parametresini güvenli bir sayıya dönüştürüyoruz
  @Patch(':id/make-urgent')
  makeUrgent(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.makeUrgent(id);
  }
  
} // Sınıf kapanış parantezi
  