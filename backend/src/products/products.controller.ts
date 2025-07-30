import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService, CreateProductDto, UpdateProductDto } from './products.service';
import { CategoriesService } from '../categories/categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBearerAuth()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with filtering' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '12',
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    let categoryId = category;
    
    // If category is provided and doesn't look like ObjectId, treat it as slug
    if (category && !category.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        const categoryDoc = await this.categoriesService.findBySlug(category);
        categoryId = categoryDoc ? (categoryDoc as any)._id.toString() : undefined;
      } catch (error) {
        console.error('Error resolving category slug:', error);
        // If category slug doesn't exist, skip filtering by category
        categoryId = undefined;
      }
    }

    const filter = {
      category: categoryId,
      brand,
      minPrice: minPrice ? +minPrice : undefined,
      maxPrice: maxPrice ? +maxPrice : undefined,
    };

    return this.productsService.findAll(
      +page,
      +limit,
      filter,
      sortBy,
      sortOrder,
      search,
    );
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  findFeatured(@Query('limit') limit: string = '8') {
    return this.productsService.findFeatured(+limit);
  }

  @Get('on-sale')
  @ApiOperation({ summary: 'Get products on sale' })
  findOnSale(@Query('limit') limit: string = '8') {
    return this.productsService.findOnSale(+limit);
  }

  @Get('best-sellers')
  @ApiOperation({ summary: 'Get best selling products' })
  findBestSellers(@Query('limit') limit: string = '8') {
    return this.productsService.findBestSellers(+limit);
  }

  @Get('brands')
  @ApiOperation({ summary: 'Get all brands' })
  getBrands() {
    return this.productsService.getBrands();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get(':id/related')
  @ApiOperation({ summary: 'Get related products' })
  findRelated(@Param('id') id: string, @Query('limit') limit: string = '4') {
    return this.productsService.findRelated(id, +limit);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update product' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete product' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
