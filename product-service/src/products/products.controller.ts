import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateProductDto,
  GetProductsDto,
  UpdateActiveDto,
  UpdateProductDto,
} from './dto/product.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { EventPattern, Payload } from '@nestjs/microservices';

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
    return this.productsService.getAllProduct(query);
  }

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Продукт успешно создан' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Продукт удалён' })
  @ApiResponse({ status: 404, description: 'Продукт не найден' })
  async delete(@Param('id') id: string) {
    await this.productsService.deleteProduct(id);
    return { message: 'Product deleted successfully' };
  }

  @Patch(':id')
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProductDto })
  async updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productsService.updateById(id, body);
  }

  @Patch(':id/active')
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateActiveDto })
  async updateProductVisisbillity(
    @Param('id') id: string,
    @Body() body: UpdateActiveDto,
  ) {
    return this.productsService.updateActiveById(id, body);
  }

  //! KAFKA CONSUMER
  @EventPattern('billing.notification.reminder')
  async handleBillingReminder(@Payload() data: any) {
    this.productsService.notificationReminder(data);
  }
  // @EventPattern('subscription.payment.getProduct')
  // async handleSubToProduct(@Payload() data: any) {
  //   this.productsService.handleProductToPayment(data);
  // }
}
