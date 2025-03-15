import {
  Controller,
  Delete,
  Param,
  Get,
  UseGuards,
  Req,
  Inject,
  Patch,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserPaymentDto } from './dto/user.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { instanceToPlain } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  @ApiOperation({ summary: 'get all users' })
  async getALLUsers() {
    return this.usersService.findAll();
  }
  @Get('profile')
  @ApiOperation({ summary: 'Protected data' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req) {
    const user = await this.usersService.findById(req.user.userId);
    const { password, ottp, ...safeUser } = user;
    return safeUser;
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') id: number): Promise<{ success: boolean }> {
    return this.usersService.deleteById(id);
  }

  @Patch('create/paymentMethod')
  @ApiOperation({ summary: 'Protected data' })
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBody({ type: UserPaymentDto })
  @UseGuards(AuthGuard('jwt'))
  async createPaymentMethod(@Req() req, @Body() bd: UserPaymentDto) {
    return this.usersService.attachPaymentMethod(
      req.user.userId,
      bd.paymentMethodId,
    );
  }
  @Patch('update/paymentMethod')
  @ApiOperation({ summary: 'Protected data' })
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBody({ type: UserPaymentDto })
  @UseGuards(AuthGuard('jwt'))
  async updatePaymentMethod(@Req() req, @Body() bd: UserPaymentDto) {
    return this.usersService.updatePaymentMethod(
      req.user.userId,
      bd.paymentMethodId,
    );
  }

  //! EVENTPATTERN
  @MessagePattern('user.getByEmail')
  async getUser(@Payload() data: any) {
    console.log(`📩 Получен запрос в MessagePattern:`, data);
    const { email } = data;
    const user = await this.usersService.findByEmail(email);
    console.log(`✅ Найден пользователь:`, user);
    return instanceToPlain(user);
  }
}
