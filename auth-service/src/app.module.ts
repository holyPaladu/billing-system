import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forRoot(databaseConfig), UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
