import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getAllSubscriptions() {
    return this.subRepository.find();
  }
  async getSubscriptionByUserId(userId: number) {
    const subWithUserId = await this.subRepository.find({ where: { userId } });
    if (!subWithUserId) throw new NotFoundException('Subscription not found');
    return subWithUserId;
  }
  async getSubscriptionByProductId(productId: string) {
    const subWithProductId = await this.subRepository.find({
      where: { productId },
    });
    if (!subWithProductId)
      throw new NotFoundException('Subscription not found');
    return subWithProductId;
  }

  async deleteSubscription(subscriptionId: string) {
    return this.subRepository.delete(subscriptionId);
  }
}
