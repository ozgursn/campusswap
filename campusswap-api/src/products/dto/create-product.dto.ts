export class CreateProductDto {
  title!: string;
  category!: string;
  campus!: string;
  price!: number;
  imageUrl?: string;
}