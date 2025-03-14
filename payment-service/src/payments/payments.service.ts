import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Payment, paymentStatus } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @Inject('STRIPE') private readonly stripe: Stripe,
  ) {}

  private sendTopic(topic: string, payment: Payment, user: any) {
    this.kafkaClient.emit(topic, {
      payment,
      user,
    });
  }

  async paying(payment: Payment, user: any) {
    try {
      const stripeResponse = await this.stripe.paymentIntents.create({
        amount: payment.amount * 100,
        currency: payment.currency,
        payment_method: user.paymentMethod,
      });
      payment.transactionId = stripeResponse.id;
      payment.status = paymentStatus.SUCCESS;
    } catch (error) {
      console.log(error);
      payment.transactionId = '';
      payment.status = paymentStatus.FAILED;
    } finally {
      await this.paymentRepository.save(payment);

      this.sendTopic('notification.paying', payment, user);
    }
  }

  async createInitialPayment(data: any) {
    const { subId, product, user } = data;

    const payment = new Payment();
    payment.subscriptionId = subId;
    payment.amount = product.price;
    payment.currency = 'KZT';
    payment.status = paymentStatus.PENDING;
    await this.paymentRepository.save(payment);

    await this.paying(payment, user);
  }
}
