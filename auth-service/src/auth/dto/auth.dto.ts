import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'securepassword', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RefreshDto {
  @ApiProperty({ example: '', description: 'User id' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: '', description: 'User refresh token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'securepassword', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ottpDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: 'Ottp' })
  @IsNumber()
  @IsNotEmpty()
  ottp: number;
}
