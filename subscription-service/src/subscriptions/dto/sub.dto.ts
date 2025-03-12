import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BillingPlan {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  QUARTERLY = 'quarterly',
}

export class CreateSubscriptionDto {
  @ApiProperty({
    example: 'monthly',
    description: 'Billing plan [monthly, yearly, quarterly]',
  })
  @IsEnum(BillingPlan)
  billingPlan: BillingPlan;
}
