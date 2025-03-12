import {
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateSubscriptionDto } from './dto/sub.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('create/:productId')
  @ApiOperation({ summary: 'create subcsription' })
  @ApiBearerAuth()
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateSubscriptionDto })
  @UseGuards(AuthGuard('jwt'))
  async(
    @Req() req,
    @Param('productId') productId: string,
    @Body() dto: CreateSubscriptionDto,
  ) {
    const userId = req.user.userId;
    return this.subscriptionsService.createSubscription(
      userId,
      productId,
      dto.billingPlan,
    );
  }
}
