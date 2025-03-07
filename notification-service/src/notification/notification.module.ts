import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailService } from 'src/email/email.service';

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
          consumer: {
            groupId: 'notification-group',
          },
        },
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, EmailService],
})
export class NotificationModule {}
