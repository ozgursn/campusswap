import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products') // Bu, adresin "http://localhost:3000/products" olacağını belirtir
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // İlan Gönderme (POST İsteki)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // İlanları Listeleme (GET İsteki)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }
}