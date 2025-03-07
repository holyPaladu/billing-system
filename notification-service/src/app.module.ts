import { Module } from '@nestjs/common';
import { KafkaService } from './kafka/kafka.service';
import { NotificationModule } from './notification/notification.module';
import { NotificationService } from './notification/notification.service';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [NotificationModule, KafkaModule],
  controllers: [],
  providers: [KafkaService, NotificationService],
})
export class AppModule {}
