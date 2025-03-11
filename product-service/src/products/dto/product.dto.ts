import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class GetProductsDto {
  @ApiProperty({
    example: 0,
    description: 'Смещение (offset) для пагинации',
    required: false,
  })
  @IsOptional()
  @IsString()
  offset?: string = '0';

  @ApiProperty({
    example: 5,
    description: 'Количество элементов на странице (limit)',
    required: false,
  })
  @IsOptional()
  @IsString()
  limit?: string = '5';
}

export class CreateProductDto {
  @ApiProperty({ example: 'Product Name', description: 'Название продукта' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'This is a great product',
    description: 'Описание продукта',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 199.99, description: 'Цена продукта' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: true, description: 'Активен ли продукт' })
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID категории',
  })
  @IsUUID()
  category: string;
}

export class UpdateProductDto {
  @ApiProperty({
    example: 'name',
    description: 'New name for product',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'text..',
    description: 'Product description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '10.00',
    description: 'Product new price',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: "Product's category id",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}

export class UpdateActiveDto {
  @ApiProperty({
    example: false,
    description: 'Update visibillity',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
