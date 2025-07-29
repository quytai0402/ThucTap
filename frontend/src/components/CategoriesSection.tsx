import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  sort?: number;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
  productCount: number;
  icon: string;
  color: string;
}

const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Icon và color mapping cho các danh mục
  const categoryConfig: Record<string, { icon: string; color: string; image: string }> = {
    'Laptop Gaming': {
      icon: '🎮',
      color: 'from-purple-600 to-pink-600',
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=400&fit=crop'
    },
    'MacBook': {
      icon: '🍎',
      color: 'from-gray-800 to-gray-900',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop'
    },
    'Laptop Văn phòng': {
      icon: '💼',
      color: 'from-blue-600 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop'
    },
    'Ultrabook': {
      icon: '💻',
      color: 'from-green-600 to-emerald-600',
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop'
    },
    'Laptop Doanh nghiệp': {
      icon: '�',
      color: 'from-indigo-600 to-purple-600',
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop'
    },
    'Laptop Sinh viên': {
      icon: '🎓',
      color: 'from-orange-600 to-red-600',
      image: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=600&h=400&fit=crop'
    }
  };

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        setLoading(true);
        
        // Lấy danh sách categories
        const categoriesResponse = await fetch('http://localhost:3001/api/categories');
        const categoriesData: ApiCategory[] = await categoriesResponse.json();
        
        // Lấy số lượng sản phẩm cho mỗi category
        const transformedCategories: Category[] = [];
        
        for (const category of categoriesData) {
          if (!category.isActive) continue;
          
          try {
            // Lấy sản phẩm theo category
            const productsResponse = await fetch(`http://localhost:3001/api/products?category=${category._id}&limit=1`);
            const productsData = await productsResponse.json();
            const productCount = productsData.total || 0;
            
            const config = categoryConfig[category.name] || {
              icon: '📱',
              color: 'from-gray-600 to-gray-700',
              image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop'
            };
            
            transformedCategories.push({
              id: category.slug,
              name: category.name,
              description: category.description,
              image: config.image,
              href: `/products?category=${category.slug}`,
              productCount,
              icon: config.icon,
              color: config.color
            });
          } catch (error) {
            console.error(`Error fetching products for category ${category.name}:`, error);
            // Vẫn hiển thị category nhưng với productCount = 0
            const config = categoryConfig[category.name] || {
              icon: '📱',
              color: 'from-gray-600 to-gray-700',
              image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop'
            };
            
            transformedCategories.push({
              id: category.slug,
              name: category.name,
              description: category.description,
              image: config.image,
              href: `/products?category=${category.slug}`,
              productCount: 0,
              icon: config.icon,
              color: config.color
            });
          }
        }
        
        // Sắp xếp theo sort order
        transformedCategories.sort((a, b) => {
          const categoryA = categoriesData.find(c => c.slug === a.id);
          const categoryB = categoriesData.find(c => c.slug === b.id);
          return (categoryA?.sort || 0) - (categoryB?.sort || 0);
        });
        
        setCategories(transformedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải danh mục...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Khám phá theo danh mục
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tìm kiếm laptop phù hợp với nhu cầu của bạn từ các danh mục đa dạng
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Category Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                
                {/* Category Icon */}
                <div className="absolute top-4 left-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-white text-xl shadow-lg`}>
                    {category.icon}
                  </div>
                </div>

                {/* Product Count */}
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                    {category.productCount} sản phẩm
                  </span>
                </div>
              </div>

              {/* Category Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>
                
                {/* View More Button */}
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-200">
                    Xem tất cả
                  </span>
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-200">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Special Offers */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Flash Sale */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white">
            <div className="p-8">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">⚡</span>
                <h3 className="text-2xl font-bold">Flash Sale</h3>
              </div>
              <p className="text-lg mb-6 opacity-90">
                Giảm giá lên đến 50% cho các sản phẩm gaming và ultrabook
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">02</div>
                  <div className="text-sm opacity-75">Ngày</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">18</div>
                  <div className="text-sm opacity-75">Giờ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">45</div>
                  <div className="text-sm opacity-75">Phút</div>
                </div>
              </div>
              <Link
                href="/products?sale=flash"
                className="inline-flex items-center px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Mua ngay
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          </div>

          {/* New Arrivals */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="p-8">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🆕</span>
                <h3 className="text-2xl font-bold">Sản phẩm mới</h3>
              </div>
              <p className="text-lg mb-6 opacity-90">
                Khám phá những laptop mới nhất với công nghệ tiên tiến
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  MacBook Pro M3 mới nhất
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Dell XPS 13 Plus 2024
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  ASUS ROG Strix G16
                </li>
              </ul>
              <Link
                href="/products?new=true"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Khám phá
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection; 