import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import Stripe from 'stripe';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
            groupId: 'user-group',
          },
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'STRIPE',
      useFactory: () => new Stripe('sk_test_...', { apiVersion: null }),
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
