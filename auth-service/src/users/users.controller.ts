import {
  Controller,
  Delete,
  Param,
  Get,
  UseGuards,
  Req,
  Inject,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

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
  getProfile(@Req() req) {
    return req.user;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') id: number): Promise<{ success: boolean }> {
    return this.usersService.deleteById(id);
  }
}
