import { Controller, Param, Post, Req, UseGuards, Body } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BillingPlan } from './entities/subscription.entity';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('create/:productId')
  @ApiOperation({ summary: 'create subcsription' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async(
    @Req() req,
    @Param('productId') productId: string,
    @Body('billingPlan') billingPlan: BillingPlan,
  ) {
    const userId = req.user.id;
    return this.subscriptionsService.createSubscription(
      userId,
      productId,
      billingPlan,
    );
  }
}
