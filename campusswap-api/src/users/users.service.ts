import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'; // UnauthorizedException eklendi
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; // JWT Servisi eklendi

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService, // Constructor'a enjekte ettik
  ) {}

  // ... (Daha önce yazdığımız register fonksiyonu aynen kalıyor)
  async register(userData: any) {
    const { name, email, password } = userData;
    if (!email.endsWith('.edu.tr')) throw new BadRequestException('Sadece .edu.tr uzantılı e-postalar kabul edilir.');
    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser) throw new BadRequestException('Bu e-posta adresi zaten kullanımda.');
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.usersRepository.create({ name, email, password: hashedPassword });
    const savedUser = await this.usersRepository.save(newUser);
    const { password: _, ...result } = savedUser;
    return result;
  }

  // GERÇEK GİRİŞ YAPMA FONKSİYONU
  async login(loginData: any) {
    const { email, password } = loginData;

    // 1. Kullanıcıyı e-postaya göre veritabanında ara
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('E-posta veya şifre hatalı.');
    }

    // 2. Siber Güvenlik: Giren şifre ile veritabanındaki hash'i karşılaştır
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('E-posta veya şifre hatalı.');
    }

    // 3. Başarılı: Kullanıcıya özel dijital JWT Token üret
    const payload = { sub: user.id, email: user.email, name: user.name };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, email: user.email }
    };
  }
}