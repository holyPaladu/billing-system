import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, RefreshDto, LoginDto, ottpDto } from './dto/auth.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'User register' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Successful register' })
  async register(@Body() user: RegisterDto) {
    return this.authService.register(user);
  }

  @Post('check_email')
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Check email' })
  @ApiBody({ type: ottpDto })
  @ApiResponse({ status: 200, description: 'Код подтвержден' })
  @ApiResponse({
    status: 409,
    description: 'Код подтверждения неверный или истёк.',
  })
  @ApiResponse({
    status: 404,
    description: 'Dont find this email',
  })
  async check_email(@Body() dto: ottpDto) {
    return this.authService.ottpChecking(dto);
  }

  @Post('login')
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Successful login' })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body);
    return this.authService.login(user);
  }

  @Post('refresh')
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Token refresh' })
  @ApiBody({ type: RefreshDto })
  @ApiResponse({ status: 200, description: 'Token success refreshed' })
  async refresh(@Body() { userId, refreshToken }: RefreshDto) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
