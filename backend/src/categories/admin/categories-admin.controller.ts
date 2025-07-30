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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CategoriesService, CreateCategoryDto, UpdateCategoryDto } from '../categories.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../common/schemas/user.schema';
import { CloudinaryService } from '../../upload/cloudinary.service';

@ApiTags('admin-categories')
@Controller('admin/categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class CategoriesAdminController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Admin: Create a new category' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Admin: Upload category image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  async uploadCategoryImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    try {
      // Upload to Cloudinary with category folder
      const uploadResult = await this.cloudinaryService.uploadImage(file, 'categories');
      
      // Update category with new image URL
      const updatedCategory = await this.categoriesService.update(id, {
        image: uploadResult.secure_url,
      });

      return {
        success: true,
        message: 'Category image uploaded successfully',
        data: {
          category: updatedCategory,
          imageUrl: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Admin: Get all categories with details' })
  findAll(@Query('isActive') isActive?: string) {
    const activeFilter = isActive !== undefined ? isActive === 'true' : undefined;
    return this.categoriesService.findAll(activeFilter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Admin: Get category by ID' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin: Update category' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Admin: Delete category' })
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(id);
    return {
      success: true,
      message: 'Category deleted successfully',
    };
  }

  @Post('create-with-image')
  @ApiOperation({ summary: 'Admin: Create category with image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        parent: { type: 'string' },
        sort: { type: 'number' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  async createWithImage(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imageUrl = '';

    try {
      // Upload image if provided
      if (file) {
        console.log('📸 Uploading file:', file.originalname, file.size);
        const uploadResult = await this.cloudinaryService.uploadImage(file, 'categories');
        console.log('☁️ Cloudinary result:', uploadResult);
        imageUrl = uploadResult.url || uploadResult.secure_url;
        console.log('🔗 Final image URL:', imageUrl);
      }

      // Create category with image URL
      const categoryData = {
        ...createCategoryDto,
        image: imageUrl || createCategoryDto.image,
      };
      console.log('💾 Creating category with data:', categoryData);

      const category = await this.categoriesService.create(categoryData);

      return {
        success: true,
        message: 'Category created successfully',
        data: category,
      };
    } catch (error) {
      console.error('❌ Error creating category:', error);
      throw new BadRequestException(`Failed to create category: ${error.message}`);
    }
  }
}
