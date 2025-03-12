import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { JwtModuleCustom } from './jwt/jwt.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    JwtModuleCustom,
    SubscriptionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
