import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite, FavoriteDocument } from '../common/schemas/favorite.schema';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<FavoriteDocument>,
  ) {}

  async addToFavorites(userId: string, productId: string): Promise<Favorite> {
    // Check if already exists
    const existing = await this.favoriteModel.findOne({
      user: userId,
      product: productId,
    });

    if (existing) {
      return existing;
    }

    const favorite = new this.favoriteModel({
      user: userId,
      product: productId,
    });

    return favorite.save();
  }

  async removeFromFavorites(userId: string, productId: string): Promise<void> {
    await this.favoriteModel.deleteOne({
      user: userId,
      product: productId,
    });
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return this.favoriteModel
      .find({ user: userId })
      .populate('product')
      .exec();
  }

  async isFavorite(userId: string, productId: string): Promise<boolean> {
    const favorite = await this.favoriteModel.findOne({
      user: userId,
      product: productId,
    });
    return !!favorite;
  }

  async getFavoriteStats(userId: string): Promise<any> {
    const total = await this.favoriteModel.countDocuments({ user: userId });
    return { total };
  }
}
