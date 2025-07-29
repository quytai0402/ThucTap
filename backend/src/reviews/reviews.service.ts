import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from '../common/schemas/review.schema';
import { Product, ProductDocument } from '../common/schemas/product.schema';

export class CreateReviewDto {
  product: string;
  customer: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export class UpdateReviewDto {
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
}

export interface ReviewFilter {
  product?: string;
  customer?: string;
  rating?: number;
}

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    // Check if user already reviewed this product
    const existingReview = await this.reviewModel.findOne({
      product: createReviewDto.product,
      customer: createReviewDto.customer,
    });

    if (existingReview) {
      throw new ForbiddenException('You have already reviewed this product');
    }

    const review = new this.reviewModel(createReviewDto);
    const savedReview = await review.save();

    // Update product rating
    await this.updateProductRating(createReviewDto.product);

    return savedReview.populate(['customer', 'product']);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filter: ReviewFilter = {},
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filter.product) query.product = filter.product;
    if (filter.customer) query.customer = filter.customer;
    if (filter.rating) query.rating = filter.rating;

    const [reviews, total] = await Promise.all([
      this.reviewModel
        .find(query)
        .populate('customer', 'name avatar')
        .populate('product', 'name image')
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }),
      this.reviewModel.countDocuments(query),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 10,
    rating?: number,
  ) {
    const skip = (page - 1) * limit;
    const query: any = { product: productId };
    
    if (rating) query.rating = rating;

    const [reviews, total, stats] = await Promise.all([
      this.reviewModel
        .find(query)
        .populate('customer', 'name avatar')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.reviewModel.countDocuments(query),
      this.getProductReviewStats(productId),
    ]);

    return {
      reviews,
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getCustomerReviews(customerId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.reviewModel
        .find({ customer: customerId })
        .populate('product', 'name image price')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.reviewModel.countDocuments({ customer: customerId }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getProductReviewStats(productId: string) {
    const stats = await this.reviewModel.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratingDistribution: {
            $push: '$rating',
          },
        },
      },
    ]);

    if (!stats.length) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const stat = stats[0];
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    stat.ratingDistribution.forEach((rating: number) => {
      distribution[rating]++;
    });

    return {
      totalReviews: stat.totalReviews,
      averageRating: Math.round(stat.averageRating * 10) / 10,
      ratingDistribution: distribution,
    };
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel
      .findById(id)
      .populate('customer', 'name avatar')
      .populate('product', 'name image');
      
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, userId: string): Promise<Review> {
    const review = await this.reviewModel.findById(id);
    
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    
    if (review.customer.toString() !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .populate(['customer', 'product']);

    // Update product rating if rating changed
    if (updateReviewDto.rating) {
      await this.updateProductRating(review.product.toString());
    }

    return updatedReview;
  }

  async remove(id: string, userId: string): Promise<void> {
    const review = await this.reviewModel.findById(id);
    
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    
    if (review.customer.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    const productId = review.product.toString();
    await this.reviewModel.findByIdAndDelete(id);

    // Update product rating after deletion
    await this.updateProductRating(productId);
  }

  async markHelpful(reviewId: string, userId: string) {
    const review = await this.reviewModel.findById(reviewId);
    
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const userObjectId = new Types.ObjectId(userId);

    // Check if user already marked as helpful
    const alreadyHelpful = review.helpfulVotes?.some(vote => vote.equals(userObjectId));
    
    if (alreadyHelpful) {
      // Remove helpful vote
      review.helpfulVotes = review.helpfulVotes.filter(vote => !vote.equals(userObjectId));
    } else {
      // Add helpful vote
      if (!review.helpfulVotes) review.helpfulVotes = [];
      review.helpfulVotes.push(userObjectId);
    }

    await review.save();
    return { helpful: !alreadyHelpful, count: review.helpfulVotes.length };
  }

  async reportReview(reviewId: string, userId: string, reason: string) {
    const review = await this.reviewModel.findById(reviewId);
    
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const userObjectId = new Types.ObjectId(userId);

    // Add to reports (you might want to create a separate reports schema)
    if (!review.reports) review.reports = [];
    review.reports.push({ userId: userObjectId, reason, reportedAt: new Date() });

    await review.save();
    return { message: 'Review reported successfully' };
  }

  private async updateProductRating(productId: string) {
    const stats = await this.getProductReviewStats(productId);
    
    await this.productModel.findByIdAndUpdate(productId, {
      rating: stats.averageRating,
      reviewCount: stats.totalReviews,
    });
  }
}
