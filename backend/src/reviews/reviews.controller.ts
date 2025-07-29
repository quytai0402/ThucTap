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
  Request 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService, CreateReviewDto, UpdateReviewDto } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiBearerAuth()
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    return this.reviewsService.create({
      ...createReviewDto,
      customer: req.user.userId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews with filtering' })
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('product') product?: string,
    @Query('customer') customer?: string,
    @Query('rating') rating?: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const filter = {
      product,
      customer,
      rating: rating ? +rating : undefined,
    };

    return this.reviewsService.findAll(+page, +limit, filter, sortBy, sortOrder);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get reviews for a specific product' })
  getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('rating') rating?: string,
  ) {
    return this.reviewsService.getProductReviews(productId, +page, +limit, rating ? +rating : undefined);
  }

  @Get('customer/:customerId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get reviews by customer' })
  @ApiBearerAuth()
  getCustomerReviews(
    @Param('customerId') customerId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.reviewsService.getCustomerReviews(customerId, +page, +limit);
  }

  @Get('product/:productId/stats')
  @ApiOperation({ summary: 'Get review statistics for a product' })
  getProductReviewStats(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviewStats(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update review' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @Request() req) {
    return this.reviewsService.update(id, updateReviewDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete review' })
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Request() req) {
    return this.reviewsService.remove(id, req.user.userId);
  }

  @Post(':id/helpful')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark review as helpful' })
  @ApiBearerAuth()
  markHelpful(@Param('id') id: string, @Request() req) {
    return this.reviewsService.markHelpful(id, req.user.userId);
  }

  @Post(':id/report')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Report review' })
  @ApiBearerAuth()
  reportReview(@Param('id') id: string, @Body('reason') reason: string, @Request() req) {
    return this.reviewsService.reportReview(id, req.user.userId, reason);
  }
}
