import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Gerçek Kayıt Olma Fonksiyonu
  async register(userData: any) {
    const { name, email, password } = userData;

    // 1. Güvenlik Duvarı: .edu.tr kontrolü (Backend tarafında da şart!)
    if (!email.endsWith('.edu.tr')) {
      throw new BadRequestException('Sadece .edu.tr uzantılı e-postalar kabul edilir.');
    }

    // 2. Güvenlik Duvarı: Bu e-posta daha önce alınmış mı?
    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser) {
      throw new BadRequestException('Bu e-posta adresi zaten kullanımda.');
    }

    // 3. Siber Güvenlik: Şifreyi hash'leme (10 tur tuzlama)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Veritabanına Güvenli Kayıt
    const newUser = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    // Şifreyi geri döndürürken gizleyelim
    const savedUser = await this.usersRepository.save(newUser);
    const { password: _, ...result } = savedUser;
    return result;
  }
}