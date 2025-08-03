import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import productService from '../services/productService';
import categoriesService from '../services/categoriesService';
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

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  displayImage?: string | null;
  productCount?: number;
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
  stock?: number; // Thêm thông tin số lượng hàng
  isNew?: boolean;
  isHot?: boolean;
}

// Helper function to get category-specific icons
const getCategoryIcon = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  
  if (name.includes('gaming') || name.includes('game')) return '🎮';
  if (name.includes('business') || name.includes('doanh nghiệp')) return '💼';
  if (name.includes('student') || name.includes('sinh viên')) return '🎓';
  if (name.includes('ultrabook')) return '⚡';
  if (name.includes('office') || name.includes('văn phòng')) return '🏢';
  if (name.includes('workstation')) return '🔧';
  if (name.includes('creative') || name.includes('sáng tạo')) return '🎨';
  
  return '💻'; // Default laptop icon
};

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Load popular categories and products in parallel
        const [categoriesResponse, initialFeaturedResponse] = await Promise.all([
          categoriesService.getPopularCategories(4).catch(() => []),
          productService.getFeaturedProducts().catch(() => null)
        ]);

        // Set categories - use popular categories with product count
        if (categoriesResponse && Array.isArray(categoriesResponse)) {
          const categoriesWithDisplay = categoriesResponse.map((cat, index) => ({
            ...cat,
            // Use real image if available, fallback to icon
            displayImage: cat.image || null,
            icon: getCategoryIcon(cat.name) || '💻'
          }));
          setCategories(categoriesWithDisplay);
        }
        
        let productsData = initialFeaturedResponse;
        
        if (!productsData || productsData.length === 0) {
          const allProductsResponse = await productService.getProducts({ 
            page: 1, 
            limit: 8
          });
          
          if (allProductsResponse && allProductsResponse.products) {
            productsData = allProductsResponse.products;
          }
        }
        
        if (productsData) {
          // Transform API data to match ProductCard interface
          const transformedProducts = productsData.map((product: any) => ({
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
            stock: product.stock || 0, // Thêm thông tin số lượng hàng
            isNew: product.isFeatured || false,
            isHot: product.isOnSale || false
          }));
          
          setProducts(transformedProducts.slice(0, 8));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Không thể tải sản phẩm');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

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
                key={category._id}
                href={`/products?category=${category.slug}`}
                className="flex items-center space-x-3 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                {category.displayImage ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <img 
                      src={category.displayImage} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <span className="text-white text-lg hidden">{category.icon}</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-lg">{category.icon}</span>
                  </div>
                )}
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