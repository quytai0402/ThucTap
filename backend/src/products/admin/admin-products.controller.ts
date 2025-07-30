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
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService, CreateProductDto, UpdateProductDto } from '../products.service';
import { ProductStatus } from '../../common/schemas/product.schema';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../common/schemas/user.schema';

@ApiTags('admin-products')
@Controller('admin/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products for admin with advanced filtering' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy: string = 'updatedAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const filter: any = {};
      
      if (category) filter.category = category;
      if (brand) filter.brand = brand;
      if (status) filter.status = status;

      const result = await this.productsService.findAll(
        +page,
        +limit,
        filter,
        sortBy,
        sortOrder,
        search,
      );

      return {
        success: true,
        data: result.products,
        pagination: {
          page: +page,
          limit: +limit,
          total: result.total,
          totalPages: Math.ceil(result.total / +limit),
        },
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to fetch products', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get product statistics for admin dashboard' })
  async getStats() {
    try {
      const stats = await this.productsService.getAdminStats();
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to fetch stats', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID for admin' })
  async findOne(@Param('id') id: string) {
    try {
      const product = await this.productsService.findOne(id);
      if (!product) {
        throw new HttpException(
          { success: false, message: 'Product not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        success: true,
        data: product,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to fetch product', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiBearerAuth()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const product = await this.productsService.create(createProductDto);
      return {
        success: true,
        message: 'Product created successfully',
        data: product,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to create product', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product (Admin only)' })
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const product = await this.productsService.update(id, updateProductDto);
      if (!product) {
        throw new HttpException(
          { success: false, message: 'Product not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        success: true,
        message: 'Product updated successfully',
        data: product,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to update product', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update product status (Admin only)' })
  @ApiBearerAuth()
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    try {
      let productStatus: ProductStatus;
      switch (status) {
        case 'active':
          productStatus = ProductStatus.ACTIVE;
          break;
        case 'inactive':
          productStatus = ProductStatus.INACTIVE;
          break;
        case 'out_of_stock':
          productStatus = ProductStatus.OUT_OF_STOCK;
          break;
        default:
          throw new HttpException(
            { success: false, message: 'Invalid status' },
            HttpStatus.BAD_REQUEST,
          );
      }

      const product = await this.productsService.update(id, { status: productStatus });
      if (!product) {
        throw new HttpException(
          { success: false, message: 'Product not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        success: true,
        message: 'Product status updated successfully',
        data: product,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to update product status', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product (Admin only)' })
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    try {
      await this.productsService.remove(id);
      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to delete product', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('bulk/delete')
  @ApiOperation({ summary: 'Bulk delete products (Admin only)' })
  @ApiBearerAuth()
  async bulkDelete(@Body('productIds') productIds: string[]) {
    try {
      const result = await this.productsService.bulkDelete(productIds);
      return {
        success: true,
        message: `${result.deletedCount} products deleted successfully`,
        data: { deletedCount: result.deletedCount },
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to delete products', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('bulk/status')
  @ApiOperation({ summary: 'Bulk update product status (Admin only)' })
  @ApiBearerAuth()
  async bulkUpdateStatus(
    @Body('productIds') productIds: string[],
    @Body('status') status: string,
  ) {
    try {
      let productStatus: ProductStatus;
      switch (status) {
        case 'active':
          productStatus = ProductStatus.ACTIVE;
          break;
        case 'inactive':
          productStatus = ProductStatus.INACTIVE;
          break;
        case 'out_of_stock':
          productStatus = ProductStatus.OUT_OF_STOCK;
          break;
        default:
          throw new HttpException(
            { success: false, message: 'Invalid status' },
            HttpStatus.BAD_REQUEST,
          );
      }

      const result = await this.productsService.bulkUpdateStatus(productIds, productStatus);
      return {
        success: true,
        message: `${result.modifiedCount} products updated successfully`,
        data: { modifiedCount: result.modifiedCount },
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to update products status', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('categories/list')
  @ApiOperation({ summary: 'Get all categories for admin' })
  async getCategories() {
    try {
      const categories = await this.productsService.getCategories();
      return {
        success: true,
        data: categories,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to fetch categories', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('brands/list')
  @ApiOperation({ summary: 'Get all brands for admin' })
  async getBrands() {
    try {
      const brands = await this.productsService.getBrands();
      return {
        success: true,
        data: brands,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to fetch brands', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
