import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import Stripe from 'stripe';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject('STRIPE') private readonly stripe: Stripe,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async findAll() {
    const users = await this.userRepository.find();
    return users.map(({ password, ottp, ...user }) => user);
  }
  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
  async findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
  async deleteById(id: number): Promise<{ success: boolean }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.remove(user);
    return { success: true };
  }
  async updateRefreshToken(userId: number, refreshToken: string) {
    await this.userRepository.update(userId, { refreshToken });
  }

  // Привязка платежного метода к пользователю
  async attachPaymentMethod(userId: number, paymentMethodId: string) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Привязка к Stripe Customer
    const stripeCustomer = await this.stripe.customers.create({
      email: user.email,
      payment_method: paymentMethodId,
    });
    // Сохранение в базе данных
    user.stripeCustomerId = stripeCustomer.id;
    user.stripePaymentMethodId = paymentMethodId;
    await this.userRepository.save(user);
  }
  async updatePaymentMethod(userId: number, newPaymentMethodId: string) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Обновление в Stripe
    await this.stripe.paymentMethods.attach(newPaymentMethodId, {
      customer: user.stripeCustomerId,
    });

    // Обновление в базе данных
    user.stripePaymentMethodId = newPaymentMethodId;
    await this.userRepository.save(user);
  }

  //! Producer
  //? Emit
  private sendTopic(topic: string, data: any, user: any) {
    this.kafkaClient.emit(topic, {
      subId: data.subId,
      product: data.product,
      user: {
        id: user.id,
        email: user.email,
        paymentMethod: user.stripePaymentMethodId,
      },
    });
  }

  //! Consumer
  async getUserDataForPayment(data: any) {
    const { subId, userEmail, product } = data;
    const user = await this.findByEmail(userEmail);
    this.sendTopic('subscription.payment.paid', data, user);
  }
}
