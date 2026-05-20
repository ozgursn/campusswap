import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users') // http://localhost:3000/users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Kayıt Olma Uç Noktası (POST /users/register)
  @Post('register')
  register(@Body() userData: any) {
    return this.usersService.register(userData);
  }
}