import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { StarIcon, HeartIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, ShoppingCartIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string | { _id: string; name: string; slug: string };
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stock?: number; // Thêm thông tin số lượng hàng
  isNew?: boolean;
  isHot?: boolean;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

// Helper function to safely extract category name
const getCategoryName = (category: string | { _id: string; name: string; slug: string } | any): string => {
  if (typeof category === 'string') return category;
  if (category && typeof category === 'object' && 'name' in category) return category.name;
  return 'Unknown';
};

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addItem } = useCart();
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  // Tính toán trạng thái stock thông minh
  const isActuallyInStock = product.inStock && (product.stock === undefined || product.stock > 0);
  const stockDisplay = product.stock !== undefined ? product.stock : (product.inStock ? 'Có' : 0);

  const handleAddToCart = async () => {
    if (!isActuallyInStock) {
      toast.error('Sản phẩm này hiện đã hết hàng!');
      return;
    }
    
    const success = await addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: getCategoryName(product.category),
    });
    
    if (success) {
      toast.success('Đã thêm vào giỏ hàng!');
    } else {
      toast.error('Không thể thêm vào giỏ hàng. Sản phẩm có thể đã hết hàng!');
    }
  };

  const handleBuyNow = async () => {
    if (!isActuallyInStock) {
      toast.error('Sản phẩm này hiện đã hết hàng!');
      return;
    }
    
    // Tạo session mua ngay riêng biệt, không thêm vào giỏ hàng chung
    const buyNowItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: getCategoryName(product.category),
      quantity: 1
    };
    
    // Lưu thông tin "mua ngay" vào sessionStorage
    sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
    sessionStorage.setItem('isBuyNow', 'true');
    
    // Chuyển thẳng đến checkout
    router.push('/checkout?mode=buynow');
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích');
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className={`group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}>
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <div className="relative w-full h-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Mới
            </span>
          )}
          {product.isHot && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Hot
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors duration-200"
        >
          <HeartIcon 
            className={`h-5 w-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
          />
        </button>

        {/* Quick Add to Cart */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            disabled={!isActuallyInStock}
            className="w-full bg-white text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isActuallyInStock ? 'Thêm vào giỏ' : 'Hết hàng'}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-gray-500 mb-1">
          {typeof product.category === 'string' ? product.category : product.category?.name || 'N/A'}
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < Math.floor(product.rating) ? (
                  <StarIconSolid className="h-4 w-4 text-yellow-400" />
                ) : (
                  <StarIcon className="h-4 w-4 text-gray-300" />
                )}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            {product.price.toLocaleString('vi-VN')}₫
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {product.originalPrice.toLocaleString('vi-VN')}₫
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className={`font-medium ${isActuallyInStock ? 'text-green-600' : 'text-red-600'}`}>
              {isActuallyInStock 
                ? (typeof stockDisplay === 'number' && stockDisplay > 0 
                  ? `Còn ${stockDisplay} sản phẩm` 
                  : 'Còn hàng') 
                : 'Hết hàng'
              }
            </span>
            {typeof stockDisplay === 'number' && stockDisplay > 0 && stockDisplay <= 5 && (
              <span className="text-orange-500 text-xs font-medium">
                Sắp hết!
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!isActuallyInStock}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            {isActuallyInStock ? 'Thêm vào giỏ' : 'Hết hàng'}
          </button>
          
          <button
            onClick={handleBuyNow}
            disabled={!isActuallyInStock}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isActuallyInStock ? 'Mua ngay' : 'Hết hàng'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 