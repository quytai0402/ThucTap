import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { productsService } from '../services/productsService';
import ProductCard from './ProductCard';

interface ApiProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  category?: string | { _id: string; name: string };
  rating?: number;
  reviewCount?: number;
  stock?: number;
  featured?: boolean;
  isActive?: boolean;
  brand?: string;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew?: boolean;
  isHot?: boolean;
}

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        
        let featuredResponse = await productsService.getFeaturedProducts();
        
        if (!featuredResponse || featuredResponse.length === 0) {
          const allProductsResponse = await productsService.getProducts({ 
            page: 1, 
            limit: 8
          });
          
          if (allProductsResponse && allProductsResponse.products) {
            featuredResponse = allProductsResponse.products;
          }
        }
        
        // Transform API data to match ProductCard interface
        const transformedProducts = featuredResponse.map((product: any) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images && product.images.length > 0 
            ? (product.images[0].startsWith('http') 
              ? product.images[0] 
              : `http://localhost:3001/uploads/${product.images[0]}`)
            : 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
          category: typeof product.category === 'object' ? product.category.name : (product.category || 'Laptop'),
          rating: product.rating || 4.5,
          reviewCount: product.reviewCount || 0,
          inStock: (product.stock || 0) > 0,
          isNew: product.isFeatured || false,
          isHot: product.isOnSale || false
        }));
        
        setProducts(transformedProducts.slice(0, 8));
        setError(null);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Không thể tải sản phẩm');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const categories = [
    { name: 'Gaming', href: '/products?category=gaming', icon: '🎮' },
    { name: 'MacBook', href: '/products?category=macbook', icon: '🍎' },
    { name: 'Văn phòng', href: '/products?category=office', icon: '💼' },
    { name: 'Ultrabook', href: '/products?category=ultrabook', icon: '💻' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sản phẩm nổi bật
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá những laptop chất lượng cao với thiết kế hiện đại và hiệu năng vượt trội
          </p>
        </div>

        {/* Category Quick Links */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="flex items-center space-x-2 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="font-medium text-gray-700">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts; 