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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CategoriesService, CreateCategoryDto, UpdateCategoryDto } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CloudinaryService } from '../upload/cloudinary.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  // @UseGuards(JwtAuthGuard) // Temporary disable for testing
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBearerAuth()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  findAll(@Query('isActive') isActive?: string) {
    const activeFilter = isActive !== undefined ? isActive === 'true' : undefined;
    return this.categoriesService.findAll(activeFilter);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get categories in tree structure' })
  findTree() {
    return this.categoriesService.findTree();
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular categories with product count' })
  findPopular(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 4;
    return this.categoriesService.findPopular(limitNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard) // Temporary disable for testing 
  @ApiOperation({ summary: 'Update category' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard) // Temporary disable for testing
  @ApiOperation({ summary: 'Delete category' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @Post('create-with-image')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create category with image upload' })
  @ApiConsumes('multipart/form-data')
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
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    try {
      let imageUrl = '';
      
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadImage(file, 'categories');
        imageUrl = uploadResult.url;
      }

      const createCategoryDto: CreateCategoryDto = {
        name: body.name,
        description: body.description,
        sort: parseInt(body.sort) || 0,
        image: imageUrl,
      };

      return this.categoriesService.create(createCategoryDto);
    } catch (error) {
      throw new BadRequestException(`Failed to create category: ${error.message}`);
    }
  }

  @Post(':id/upload-image')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload image for existing category' })
  @ApiConsumes('multipart/form-data')
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
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    try {
      const uploadResult = await this.cloudinaryService.uploadImage(file, 'categories');
      
      const updateData: UpdateCategoryDto = {
        image: uploadResult.url,
      };

      return this.categoriesService.update(id, updateData);
    } catch (error) {
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }
}
