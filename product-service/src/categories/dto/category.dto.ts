import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'Название категории' })
  @IsString()
  name: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID родительской категории (если есть)',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  parent?: string;
}
