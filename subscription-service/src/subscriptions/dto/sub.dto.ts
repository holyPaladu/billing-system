import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum BillingPlanEnum {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  QUARTERLY = 'quarterly',
}

export class BillingPlan {
  @ApiProperty({
    example: BillingPlanEnum.MONTHLY,
    description: '[monthly, yearly, quarterly]',
    required: false,
  })
  @IsEnum(BillingPlanEnum)
  plan: BillingPlanEnum;
}
