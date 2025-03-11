import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetProductsDto } from './dto/product.dto';

@ApiTags('Products')
@ApiExtraModels(GetProductsDto) // Автоматически документирует DTO
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('jwt')
  @ApiOperation({ summary: 'Protected data' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req) {
    return req.user;
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true })) // Автоматически преобразует строки в числа
  @ApiResponse({
    status: 200,
    description: 'Список продуктов с пагинацией',
    schema: {
      example: {
        data: [
          {
            id: '1',
            name: 'Product 1',
            category: { id: '10', name: 'Category A' },
          },
        ],
        meta: {
          total: 100,
          offset: 0,
          limit: 10,
        },
      },
    },
  })
  async getAll(@Query() query: GetProductsDto) {
    return this.productsService.getAllProduct(query.offset, query.limit);
  }
}
