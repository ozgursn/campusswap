import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common'; // ParseIntPipe eklendi
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // Güvenlik Kalkanı: ParseIntPipe, gelen "id" string değilse veya harf içeriyorsa
  // veritabanını hiç yormadan doğrudan "400 Bad Request" hatası döndürür.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { 
    return this.productsService.findOne(id); 
  }
  // Kullanıcının kendi ilanlarını çekmesi için endpoint
  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.productsService.findByUser(userId);
  }
}