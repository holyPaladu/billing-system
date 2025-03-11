import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto, GetProductsDto } from './dto/product.dto';
import { Category } from 'src/categories/entyties/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAllProduct(query: GetProductsDto) {
    const [products, total] = await this.productRepository.findAndCount({
      relations: ['category'],
      take: Number(query.limit),
      skip: Number(query.offset),
    });
    return {
      data: products,
      meta: {
        total,
        offset: Number(query.offset),
        limit: Number(query.limit),
      },
    };
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { name, description, price, is_active, category } = createProductDto;

    // Проверяем, существует ли категория
    const categoryExist = await this.categoryRepository.findOne({
      where: { id: category },
    });
    if (!categoryExist) {
      throw new NotFoundException('Category not found');
    }

    // Создаём продукт
    const product = this.productRepository.create({
      name,
      description,
      price,
      is_active,
      category: categoryExist, // Связываем продукт с категорией
    });

    return this.productRepository.save(product);
  }

  async deleteProduct(id: string) {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Product not found');
    }
    return {
      success: true,
    };
  }
}
