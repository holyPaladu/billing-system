import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_PRODUCER', // Указываем токен провайдера
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'billing-service',
            brokers: ['localhost:9092'], // Укажи свой брокер Kafka
          },
          producerOnlyMode: true, // Только продюсер
        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
