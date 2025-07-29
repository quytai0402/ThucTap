import api from '../utils/api';

export interface Favorite {
  _id: string;
  user: string;
  product: {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    images: string[];
    rating: number;
    brand: string;
    status: string;
  };
  createdAt: string;
}

export interface FavoriteStats {
  totalFavorites: number;
  recentFavorites: Favorite[];
}

class FavoritesService {
  // Add product to favorites
  async addToFavorites(productId: string) {
    try {
      const response = await api.post(`/favorites/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  // Remove product from favorites
  async removeFromFavorites(productId: string) {
    try {
      await api.delete(`/favorites/${productId}`);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }

  // Get user's favorites
  async getFavorites(page: number = 1, limit: number = 10) {
    try {
      const response = await api.get(`/favorites?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }

  // Check if product is in favorites
  async checkFavorite(productId: string): Promise<boolean> {
    try {
      const response = await api.get(`/favorites/${productId}/check`);
      return response.data.isFavorite || false;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }

  // Get favorites statistics
  async getFavoriteStats(): Promise<FavoriteStats> {
    try {
      const response = await api.get('/favorites/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching favorite stats:', error);
      throw error;
    }
  }

  // Toggle favorite status
  async toggleFavorite(productId: string): Promise<{ isFavorite: boolean }> {
    try {
      const isFavorite = await this.checkFavorite(productId);
      
      if (isFavorite) {
        await this.removeFromFavorites(productId);
        return { isFavorite: false };
      } else {
        await this.addToFavorites(productId);
        return { isFavorite: true };
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }
}

export const favoritesService = new FavoritesService();
export default favoritesService;
