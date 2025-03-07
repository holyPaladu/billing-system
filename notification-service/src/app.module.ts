import { Module } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module';
import { NotificationService } from './notification/notification.service';
import { EmailService } from './email/email.service';

@Module({
  imports: [NotificationModule],
  controllers: [],
  providers: [NotificationService, EmailService],
})
export class AppModule {}
