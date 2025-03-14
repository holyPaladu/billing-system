import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import {
  CreateProductDto,
  GetProductsDto,
  UpdateActiveDto,
  UpdateProductDto,
} from './dto/product.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly categoryService: CategoriesService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  //! BASE SERVICE
  async findProductById(id: string) {
    const product = await this.productRepository.findOne({ where: { id: id } });
    if (!product) throw new NotFoundException('Not found that product');
    return product;
  }

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
    const categoryExist = await this.categoryService.findCategoryById(category);

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

  async updateById(id: string, updatedData: UpdateProductDto) {
    const product = await this.findProductById(id);

    if (updatedData.categoryId) {
      const category = await this.categoryService.findCategoryById(
        updatedData.categoryId,
      );
      product.category = category;
    }
    // Убираем undefined, чтобы не затирать поля
    const filteredData = Object.fromEntries(
      Object.entries(updatedData).filter(
        ([_, v]) => v !== undefined && v !== '',
      ),
    );
    Object.assign(product, filteredData);
    return this.productRepository.save(product);
  }
  async updateActiveById(id: string, updatedData: UpdateActiveDto) {
    const product = await this.findProductById(id);
    if (updatedData.is_active !== null || updatedData.is_active !== undefined) {
      product.is_active = updatedData.is_active;
    }
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

  //! EventPattern
  async notificationReminder(data: any) {
    const { subId, userEmail, productId } = data;
    const product = await this.findProductById(productId);

    this.kafkaClient.emit('billing.notification.reminder.product', {
      subId,
      userEmail,
      product: {
        price: product.price,
        plan: product.plan,
        name: product.name,
        is_active: product.is_active,
      },
    });
  }
  async handleProductToPayment(data: any) {
    const { subId, userEmail, productId } = data;
    const product = await this.findProductById(productId);

    this.kafkaClient.emit('subscription.payment', {
      subId,
      userEmail,
      product: {
        price: product.price,
        plan: product.plan,
        name: product.name,
        is_active: product.is_active,
      },
    });
  }
}
