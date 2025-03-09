import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { ProductsModule } from './products/products.module';
import { JwtModuleCustom } from './jwt/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ProductsModule,
    JwtModuleCustom,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
