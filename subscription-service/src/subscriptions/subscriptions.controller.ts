import {
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
  Body,
  UseInterceptors,
  Get,
  Delete,
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
    return this.subscriptionsService.createSubscription(
      req.user.userId,
      req.user.email,
      productId,
      dto.billingPlan,
    );
  }

  @Get()
  @ApiOperation({ summary: 'get all subscriptions' })
  async getAllSubscriptions() {
    return this.subscriptionsService.getAllSubscriptions();
  }
  @Get('users')
  @ApiOperation({ summary: 'get subscription by user id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getSubscriptionByUserId(@Req() req) {
    return this.subscriptionsService.getSubscriptionByUserId(req.user.userId);
  }
  @Get(':productId')
  @ApiOperation({ summary: 'get subscription by product id' })
  async getSubscriptionByProductId(@Param('productId') productId: string) {
    return this.subscriptionsService.getSubscriptionByProductId(productId);
  }

  @Delete(':subscriptionId')
  @ApiOperation({ summary: 'delete subscription by id' })
  async deleteSubscription(@Param('subscriptionId') subscriptionId: string) {
    return this.subscriptionsService.deleteSubscription(subscriptionId);
  }
}
