import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Subscription,
  SubscriptionStatus,
  BillingPlan,
} from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { calculateSubscriptionDates } from './utils/sub-dates.util';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subRepository: Repository<Subscription>,
  ) {}

  async createSubscription(
    userId: number,
    productId: string,
    plan: BillingPlan,
  ) {
    const { startDate, endDate, nextBillingDate } =
      calculateSubscriptionDates(plan);

    const subscription = this.subRepository.create({
      userId,
      productId,
      billingPlan: plan,
      startDate,
      endDate,
      nextBillingDate,
      status: SubscriptionStatus.ACTIVE,
    });

    return this.subRepository.save(subscription);
  }
}
