import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Inject,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { RegisterDto, ottpDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly userService: UsersService,
    private jwtService: JwtService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
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

    // Генерация OTP-кода
    const ottp = Math.floor(1000 + Math.random() * 9000); // 4-значный код

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create({
      email: user.email,
      password: hashedPassword,
      ottp: ottp,
    });

    await this.userRepository.save(newUser);

    // Отправляем сообщение в Kafka
    this.kafkaClient.emit('user.registered', {
      email: user.email,
      ottp: ottp,
      timestamp: new Date().toISOString(),
    });

    return { message: 'Регистрация успешна' };
  }
  async ottpChecking(dto: ottpDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new NotFoundException('Dont find this email');

    if (user.ottp !== Number(dto.ottp)) {
      throw new ConflictException('Код подтверждения неверный или истёк.');
    }
    await this.userRepository.update(
      { id: user.id },
      { ottp: null, is_email_verified: true },
    );

    return {
      status: HttpStatus.OK,
      message: 'Код подтвержден',
    };
  }
}
