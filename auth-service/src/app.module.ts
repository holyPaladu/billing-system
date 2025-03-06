import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [AuthModule, TypeOrmModule.forRoot(databaseConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {}
