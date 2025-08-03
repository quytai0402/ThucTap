import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  bgColor: string;
}

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      title: "Laptop Gaming Cao Cấp",
      subtitle: "Trải nghiệm game mượt mà",
      description: "Khám phá bộ sưu tập laptop gaming với hiệu năng mạnh mẽ, thiết kế gaming độc đáo và giá cả hợp lý.",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1200&h=600&fit=crop",
      buttonText: "Xem ngay",
      buttonLink: "/products?category=gaming",
      bgColor: "from-purple-600 to-blue-600"
    },
    {
      id: 2,
      title: "MacBook Pro M2",
      subtitle: "Hiệu năng đỉnh cao",
      description: "Trải nghiệm sức mạnh của chip M2 với hiệu năng vượt trội, pin trâu và thiết kế siêu mỏng.",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=600&fit=crop",
      buttonText: "Khám phá",
      buttonLink: "/products?category=macbook",
      bgColor: "from-gray-800 to-gray-900"
    },
    {
      id: 3,
      title: "Laptop Văn Phòng",
      subtitle: "Làm việc hiệu quả",
      description: "Bộ sưu tập laptop văn phòng với thiết kế gọn nhẹ, hiệu năng ổn định và giá cả phải chăng.",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=600&fit=crop",
      buttonText: "Tìm hiểu",
      buttonLink: "/products?category=office",
      bgColor: "from-blue-600 to-green-600"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-[600px] overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Text Content */}
                  <div className="text-white">
                    <div className="mb-4">
                      <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                        {slide.subtitle}
                      </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={slide.buttonLink}
                        className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        {slide.buttonText}
                      </Link>
                      <Link
                        href="/products"
                        className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors duration-200"
                      >
                        Xem tất cả
                      </Link>
                    </div>
                  </div>

                  {/* Image/Visual Element */}
                  <div className="hidden lg:block">
                    <div className="relative">
                      <div className={`w-96 h-96 mx-auto rounded-full bg-gradient-to-br ${slide.bgColor} opacity-20`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-6xl mb-4">💻</div>
                          <div className="text-2xl font-bold">IT-Global</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors duration-200"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors duration-200"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Features Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-1">🚚</div>
              <div className="text-sm font-medium text-gray-700">Giao hàng 24h</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-1">🛡️</div>
              <div className="text-sm font-medium text-gray-700">Bảo hành chính hãng</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-1">💰</div>
              <div className="text-sm font-medium text-gray-700">Giá tốt nhất</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-1">📞</div>
              <div className="text-sm font-medium text-gray-700">Hỗ trợ 24/7</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 