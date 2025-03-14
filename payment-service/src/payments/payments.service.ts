import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Payment, paymentStatus } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async paying(payment: Payment, price: number) {
    try {
      // const stripeResponse = await stripe.paymentIntents.create({
      //   amount: price * 100,
      //   currency: 'KZT',
      //   payment_method: 'stripe',
      // });
      payment.transactionId = 'unique_transaction_code'; // Симуляция успешного платежа
      payment.status = paymentStatus.SUCCESS;
    } catch (error) {
      console.log(error);
      payment.transactionId = '';
      payment.status = paymentStatus.FAILED;
    } finally {
      await this.paymentRepository.save(payment);
    }
  }

  async createInitialPayment(data: any) {
    const { subId, userEmail, product } = data;

    const payment = new Payment();
    payment.subscriptionId = subId;
    payment.amount = product.price;
    payment.currency = 'KZT'; // Валюта обязательна!
    payment.status = paymentStatus.PENDING;
    await this.paymentRepository.save(payment);

    await this.paying(payment, product.price);
  }
}
