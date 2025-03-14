import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserPaymentDto {
  @ApiProperty({
    example: 'hkj342g4jh34j2h',
    description: 'Уникальный номер платежного метода',
  })
  @IsString()
  paymentMethodId: string;
}
