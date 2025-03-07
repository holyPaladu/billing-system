import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(user: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
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
