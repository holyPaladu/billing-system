import { IsEnum } from 'class-validator';
import { BillingPlan } from '../entities/subscription.entity';

export class CreateSubscriptionDto {
  @IsEnum(BillingPlan)
  billingPlan: BillingPlan;
}
