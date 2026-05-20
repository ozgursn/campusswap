import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt'; // Eklendi
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // JWT Ayar Kapısı: token'ları imzalamak için gizli bir kelime veriyoruz
    JwtModule.register({
      secret: 'KAMPUS_SWAP_GIZLI_ANAHTAR_99', 
      signOptions: { expiresIn: '1d' }, // Token 1 gün boyunca geçerli olsun
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}