import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Kullanıcı tablosunu import ettik

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  category!: string;

  @Column()
  campus!: string;

  @Column('decimal')
  price!: number;

  @Column({ nullable: true })
  imageUrl!: string;

  @CreateDateColumn()
  createdAt!: Date;

  // İlişki Kapısı: Bu ilanı açan kullanıcıyı belirtir
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user!: User;

  @Column()
  userId!: number; // İlişkiyi id bazında yönetmek için kolaylık sağlar
}