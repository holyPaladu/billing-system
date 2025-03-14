import { Controller } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @EventPattern('subscription.payment.createPayment')
  async handleSubToProduct(@Payload() data: any) {
    return;
  }
}
