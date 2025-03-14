import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Subscription,
  SubscriptionStatus,
  BillingPlan,
} from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { calculateSubscriptionDates } from './utils/sub-dates.util';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subRepository: Repository<Subscription>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async createSubscription(
    userId: number,
    email: string,
    productId: string,
    plan: BillingPlan,
  ) {
    const { startDate, endDate, nextBillingDate } =
      calculateSubscriptionDates(plan);

    const subscription = this.subRepository.create({
      userId,
      userEmail: email,
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
    return await this.subRepository.find();
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

  //! KAFKA producer
  private sendBillingReminder(subscription: Subscription) {
    this.kafkaClient.emit('billing.notification.reminder', {
      subId: subscription.id,
      userEmail: subscription.userEmail,
      productId: subscription.productId,
    });
  }
  private processSubscription(subscription: Subscription) {
    this.kafkaClient.emit('subscription.payment.getProduct', {
      subId: subscription.id,
      userEmail: subscription.userEmail,
      productId: subscription.productId,
    });
  }
  //! CRON task
  async checkSubscriptions() {
    const subscriptions = await this.getAllSubscriptions();
    const now = new Date();

    for (const subscription of subscriptions) {
      if (
        subscription.status === SubscriptionStatus.PAUSE ||
        subscription.status === SubscriptionStatus.EXPIRE
      ) {
        continue;
      }

      const nextBillingDate = new Date(subscription.nextBillingDate);
      const diffDays = Math.floor(
        (nextBillingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 2) {
        this.sendBillingReminder(subscription);
      } else if (diffDays === 0) {
        this.processSubscription(subscription);
      } else if (diffDays < 0) {
        subscription.status = SubscriptionStatus.EXPIRE;
        await this.subRepository.save(subscription);
      }
    }
  }
}
