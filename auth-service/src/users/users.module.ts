import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import Stripe from 'stripe';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
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
