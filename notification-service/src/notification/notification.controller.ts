import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailService } from 'src/email/email.service';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly emailService: EmailService,
  ) {}

  @EventPattern('user.registered')
  async handleUserLogin(@Payload() data: any) {
    const { email, ottp } = data;
    this.emailService.sendVerificationEmail(email, String(ottp));
  }

  @EventPattern('billing.notification.reminder.product')
  async handleBillingReminder(@Payload() data: any) {
    const { subId, userEmail, product } = data;
    this.emailService.sendReminder(subId, userEmail, product);
  }
}
