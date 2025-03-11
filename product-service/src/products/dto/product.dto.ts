import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsOptional } from 'class-validator';

export class GetProductsDto {
  @ApiProperty({
    example: 0,
    description: 'Смещение (offset) для пагинации',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiProperty({
    example: 5,
    description: 'Количество элементов на странице (limit)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 5;
}
