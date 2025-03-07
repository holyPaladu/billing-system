import { Controller, Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('notification')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('user.registered')
  async handleUserLogin(@Payload() data: any) {
    this.logger.log(`Received event: ${JSON.stringify(data)}`);
    console.log(`${data}`);
  }
}
