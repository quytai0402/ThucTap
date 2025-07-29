import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':productId')
  @ApiOperation({ summary: 'Add product to favorites' })
  async addToFavorites(@Request() req, @Param('productId') productId: string) {
    return this.favoritesService.addToFavorites(req.user.sub, productId);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove product from favorites' })
  async removeFromFavorites(@Request() req, @Param('productId') productId: string) {
    await this.favoritesService.removeFromFavorites(req.user.sub, productId);
    return { message: 'Removed from favorites' };
  }

  @Get()
  @ApiOperation({ summary: 'Get user favorites' })
  async getUserFavorites(@Request() req) {
    return this.favoritesService.getUserFavorites(req.user.sub);
  }

  @Get(':productId/check')
  @ApiOperation({ summary: 'Check if product is favorite' })
  async isFavorite(@Request() req, @Param('productId') productId: string) {
    const isFavorite = await this.favoritesService.isFavorite(req.user.sub, productId);
    return { isFavorite };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get favorites stats' })
  async getFavoriteStats(@Request() req) {
    return this.favoritesService.getFavoriteStats(req.user.sub);
  }
}
