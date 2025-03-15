import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Subscription,
  SubscriptionStatus,
  BillingPlan,
} from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { calculateSubscriptionDates } from './utils/sub-dates.util';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SubscriptionsService implements OnModuleInit {
  constructor(
    @InjectRepository(Subscription)
    private readonly subRepository: Repository<Subscription>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}
  async onModuleInit() {
    // Подписываемся на ответный топик
    this.kafkaClient.subscribeToResponseOf('user.getByEmail');
    await this.kafkaClient.connect();
  }

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
  private async processSubscription(subscription: Subscription) {
    try {
      // 1️⃣ Запрашиваем пользователя
      const user = await this.requestUser(subscription.userEmail);
      if (!user) {
        console.error(`❌ Пользователь ${subscription.userEmail} не найден!`);
        return;
      }

      // 2️⃣ Запрашиваем продукт
      const product = await this.requestProduct(subscription.productId);
      if (!product) {
        console.error(`❌ Продукт ${subscription.productId} не найден!`);
        return;
      }

      // 3️⃣ Отправляем данные в оплату
      this.kafkaClient.emit('subscription.payment.paid', {
        subId: subscription.id,
        user,
        product,
      });

      console.log(`✅ Отправлен запрос на оплату: subId ${subscription.id}`);
    } catch (error) {
      console.error('❌ Ошибка обработки подписки:', error);
    }
  }

  private async requestUser(email: string) {
    try {
      const user = await firstValueFrom(
        this.kafkaClient.send('user.getByEmail', { email }),
      );
      return user;
    } catch (error) {
      console.error('Ошибка при запросе пользователя:', error);
      return null;
    }
  }

  private async requestProduct(productId: string) {
    try {
      const product = await firstValueFrom(
        this.kafkaClient.send('product.getById', { productId }),
      );
      return product;
    } catch (error) {
      console.error('Ошибка при запросе продукта:', error);
      return null;
    }
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
      // else if (diffDays > 2) {
      //   const data = await this.requestUser(subscription.userEmail);
      //   console.log(typeof data, data);
      //   console.log(JSON.stringify(data, null, 2), subscription.userEmail);
      // }
    }
  }
}
