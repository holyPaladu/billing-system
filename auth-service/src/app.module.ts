import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { KafkaService } from './kafka/kafka.service';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(databaseConfig),
    UsersModule,
    KafkaModule,
  ],
  controllers: [],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class AppModule {}
