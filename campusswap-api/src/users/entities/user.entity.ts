import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users') // Veritabanındaki tablo adı
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true }) // Aynı e-posta ile iki kez kayıt olunamasın
  email!: string;

  @Column()
  password!: string; // Şifrelenmiş olarak tutacağız

  @CreateDateColumn()
  createdAt!: Date;
  
  @Column({ nullable: true })
  pushToken!: string;

}
