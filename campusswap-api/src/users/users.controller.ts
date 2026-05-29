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

  // Giriş Yapma Uç Noktası (POST /users/login)
  @Post('login')
  login(@Body() loginData: any) {
    return this.usersService.login(loginData);
  }

  // 🔔 3. ADIM: Cihaz Bildirim Tokenını Kaydetme Kapısı (POST /users/save-token)
  @Post('save-token')
  saveToken(@Body() body: { userId: number; pushToken: string }) {
    return this.usersService.updatePushToken(body.userId, body.pushToken);
  }
}