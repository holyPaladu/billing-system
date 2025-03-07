import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class KafkaService {
  constructor(
    @Inject('KAFKA_PRODUCER') private readonly kafkaClient: ClientKafka,
  ) {}

  async sendMessage(topic: string, message: any) {
    await this.kafkaClient.emit(topic, message);
    console.log(`📤 Kafka: Сообщение отправлено в топик "${topic}"`);
  }
}
