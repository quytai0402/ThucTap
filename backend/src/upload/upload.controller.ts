import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  
  @Post('image')
  @ApiOperation({ summary: 'Upload single image to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        folder: {
          type: 'string',
          description: 'Optional folder name for organization',
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
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(file, folder);
      
      return {
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: result.url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Post('images')
  @ApiOperation({ summary: 'Upload multiple images to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        folder: {
          type: 'string',
          description: 'Optional folder name for organization',
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
      },
    }),
  )
  async uploadImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('folder') folder?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No image files provided');
    }

    try {
      const results = await this.cloudinaryService.uploadMultipleImages(files, folder);
      
      return {
        success: true,
        message: `${results.length} images uploaded successfully`,
        data: results.map(result => ({
          url: result.url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes,
        })),
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete image from Cloudinary' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        public_id: {
          type: 'string',
          description: 'Cloudinary public ID of the image to delete',
        },
      },
      required: ['public_id'],
    },
  })
  async deleteImage(@Body('public_id') publicId: string) {
    if (!publicId) {
      throw new BadRequestException('Public ID is required');
    }

    try {
      const result = await this.cloudinaryService.deleteImage(publicId);
      
      return {
        success: true,
        message: 'Image deleted successfully',
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }

  @Post('delete-multiple')
  @ApiOperation({ summary: 'Delete multiple images from Cloudinary' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        public_ids: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Array of Cloudinary public IDs to delete',
        },
      },
      required: ['public_ids'],
    },
  })
  async deleteImages(@Body('public_ids') publicIds: string[]) {
    if (!publicIds || publicIds.length === 0) {
      throw new BadRequestException('Public IDs are required');
    }

    try {
      const result = await this.cloudinaryService.deleteImages(publicIds);
      
      return {
        success: true,
        message: `${publicIds.length} images deleted successfully`,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }
}
