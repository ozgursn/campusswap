import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number; // Ünlem eklendi

  @Column()
  title!: string; // Ünlem eklendi

  @Column()
  category!: string; // Ünlem eklendi

  @Column()
  campus!: string; // Ünlem eklendi

  @Column('decimal')
  price!: number; // Ünlem eklendi

  @Column({ nullable: true })
  imageUrl?: string; // Soru işareti zaten boş kalabilir demek (nullable)

  @CreateDateColumn()
  createdAt!: Date; // Ünlem eklendi
}