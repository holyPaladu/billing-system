import { Injectable, OnModuleInit } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class NotificationService implements OnModuleInit {
  // constructor(private readonly emailService: EmailService) {}

  async onModuleInit() {
    console.log('📩 Notification Service готов к приему Kafka сообщений...');
  }

  // 📌 Слушаем события из Kafka (user_registered)
  @MessagePattern('user_registered')
  async handleUserRegistered(@Payload() email: string) {
    console.log('📥 Получено сообщение из Kafka:', email);

    // Отправляем email
    // await this.emailService.sendEmail(
    //   user.email,
    //   'Welcome!',
    //   `Привет, ${user.name}! Спасибо за регистрацию!`,
    // );

    console.log(`📧 Email отправлен на: ${email}`);
  }
}
