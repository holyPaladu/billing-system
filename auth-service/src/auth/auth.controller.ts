import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Get,
  UseGuards,
  Req,
  Inject,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, RefreshDto } from './dto/auth.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

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

  @Post('login')
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 200, description: 'Successful login' })
  async login(@Body() body: RegisterDto) {
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

  @Get('profile')
  @ApiOperation({ summary: 'Protected data' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }
}
