import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getAllProduct(offset: number, limit: number) {
    const [products, total] = await this.productRepository.findAndCount({
      relations: ['category_id'],
      take: limit,
      skip: offset,
    });
    return {
      data: products,
      meta: {
        total,
        offset,
        limit,
      },
    };
  }
}
