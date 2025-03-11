import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entyties/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getAll() {
    return this.categoryRepository.find({
      relations: ['children', 'products_id'],
    });
  }

  async createCategory(createCategory: CreateCategoryDto) {
    const category = this.categoryRepository.create({
      name: createCategory.name,
      parent: createCategory.parent
        ? await this.categoryRepository.findOne({
            where: { id: createCategory.parent },
          })
        : null,
    });

    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: string): Promise<{ message: string }> {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    await this.categoryRepository.remove(category);
    return { message: 'Категория успешно удалена' };
  }
}
