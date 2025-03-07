import { Module } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module';
import { NotificationService } from './notification/notification.service';

@Module({
  imports: [NotificationModule],
  controllers: [],
  providers: [NotificationService],
})
export class AppModule {}
