import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/category.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Category')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategory() {
    return this.categoriesService.getAll();
  }

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCategoryDto })
  @ApiOperation({ summary: 'Создать категорию' })
  @ApiResponse({
    status: 201,
    description: 'Категория успешно создана',
    type: Category,
  })
  async createCategory(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.createCategory(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить категорию' })
  @ApiResponse({ status: 200, description: 'Категория успешно удалена' })
  async deleteCategory(@Param('id') id: string): Promise<{ message: string }> {
    return this.categoriesService.deleteCategory(id);
  }
}
