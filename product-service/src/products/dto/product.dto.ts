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
