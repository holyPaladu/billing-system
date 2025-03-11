import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { ProductsModule } from './products/products.module';
import { JwtModuleCustom } from './jwt/jwt.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ProductsModule,
    JwtModuleCustom,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
