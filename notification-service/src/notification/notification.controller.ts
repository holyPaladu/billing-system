import { Controller, Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailService } from 'src/email/email.service';

@Controller('notification')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly emailService: EmailService,
  ) {}

  @EventPattern('user.registered')
  async handleUserLogin(@Payload() data: any) {
    this.logger.log(`Received event: ${JSON.stringify(data)}`);
    const { email, ottp } = data;
    this.emailService.sendVerificationEmail(email, String(ottp));
  }
}
