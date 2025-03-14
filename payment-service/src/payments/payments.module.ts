import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import Stripe from 'stripe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka:9092'],
          },
          producer: {
            allowAutoTopicCreation: true,
          },
          consumer: {
            groupId: 'payment-group',
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([Payment]),
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    {
      provide: 'STRIPE',
      useFactory: () => new Stripe('sk_test_...'),
    },
  ],
})
export class PaymentsModule {}
