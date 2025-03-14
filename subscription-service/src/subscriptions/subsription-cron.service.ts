import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionsService } from './subscriptions.service';

@Injectable()
export class SubscriptionCronService {
  constructor(private readonly subscriptionService: SubscriptionsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) 
  async handleCron() {
    console.log('Running daily subscription check');
    await this.subscriptionService.checkSubscriptions();
  }

  //! TEST Run the cron job every minute for testing purposes
  // @Cron(CronExpression.EVERY_MINUTE)
  // async handleCronMin() {
  //   console.log('Running subscription check every minute');
  //   await this.subscriptionService.checkSubscriptions();
  // }
}
