import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewRequestDto {
  @ApiProperty({ description: 'Product ID' })
  @IsString()
  product: string;

  @ApiProperty({ description: 'Rating from 1 to 5', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Review title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Review comment' })
  @IsString()
  comment: string;

  @ApiProperty({ description: 'Review images', required: false })
  @IsOptional()
  @IsString({ each: true })
  images?: string[];
}
