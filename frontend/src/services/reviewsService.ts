import api from '../utils/api';

export interface Review {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string[];
  };
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpfulVotes: string[];
  reports: Array<{
    userId: string;
    reason: string;
    reportedAt: string;
  }>;
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  product: string;
  rating: number;
  title: string;
  comment: string;
}

export interface UpdateReviewData {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface ReviewFilters {
  page?: number;
  limit?: number;
  rating?: number;
  verified?: boolean;
  sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful';
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  verifiedPurchasePercentage: number;
}

export interface ReportReviewData {
  reason: string;
}

class ReviewsService {
  // Create review
  async createReview(reviewData: CreateReviewData) {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  // Get all reviews with filters
  async getReviews(filters?: ReviewFilters) {
    try {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.rating) params.append('rating', filters.rating.toString());
      if (filters?.verified !== undefined) params.append('verified', filters.verified.toString());
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);

      const response = await api.get(`/reviews?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  // Get reviews for a specific product
  async getProductReviews(productId: string, filters?: ReviewFilters) {
    try {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.rating) params.append('rating', filters.rating.toString());
      if (filters?.verified !== undefined) params.append('verified', filters.verified.toString());
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);

      const response = await api.get(`/reviews/product/${productId}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw error;
    }
  }

  // Get reviews by customer
  async getCustomerReviews(customerId: string, page: number = 1, limit: number = 10) {
    try {
      const response = await api.get(`/reviews/customer/${customerId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer reviews:', error);
      throw error;
    }
  }

  // Get review statistics for a product
  async getProductReviewStats(productId: string): Promise<ReviewStats> {
    try {
      const response = await api.get(`/reviews/product/${productId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product review stats:', error);
      throw error;
    }
  }

  // Get single review
  async getReview(reviewId: string) {
    try {
      const response = await api.get(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching review:', error);
      throw error;
    }
  }

  // Update review
  async updateReview(reviewId: string, updateData: UpdateReviewData) {
    try {
      const response = await api.patch(`/reviews/${reviewId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  // Delete review
  async deleteReview(reviewId: string) {
    try {
      await api.delete(`/reviews/${reviewId}`);
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  // Mark review as helpful
  async markReviewHelpful(reviewId: string) {
    try {
      const response = await api.post(`/reviews/${reviewId}/helpful`);
      return response.data;
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      throw error;
    }
  }

  // Report review
  async reportReview(reviewId: string, reportData: ReportReviewData) {
    try {
      const response = await api.post(`/reviews/${reviewId}/report`, reportData);
      return response.data;
    } catch (error) {
      console.error('Error reporting review:', error);
      throw error;
    }
  }

  // Get my reviews (for logged-in customer)
  async getMyReviews(page: number = 1, limit: number = 10) {
    try {
      const response = await api.get(`/reviews?page=${page}&limit=${limit}&mine=true`);
      return response.data;
    } catch (error) {
      console.error('Error fetching my reviews:', error);
      throw error;
    }
  }
}

export const reviewsService = new ReviewsService();
export default reviewsService;
