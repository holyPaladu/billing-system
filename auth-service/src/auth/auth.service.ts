import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  //! token
  async generateTokens(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || user.refreshToken !== refreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  //! login
  async validateUser(dto: RegisterDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }
  async login(user: any) {
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  //! register
  async register(user: RegisterDto) {
    const existingUser = await this.userService.findByEmail(user.email);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create({
      email: user.email,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);
    return { message: 'Регистрация успешна' };
  }
}
