import React from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface SearchSuggestion {
  text: string;
  href: string;
  type: 'category' | 'brand' | 'page';
}

interface SearchHelpProps {
  searchTerm: string;
  resultCount: number;
}

const SearchHelp: React.FC<SearchHelpProps> = ({ searchTerm, resultCount }) => {
  const suggestions: SearchSuggestion[] = [
    { text: 'Laptop Gaming', href: '/products?category=gaming', type: 'category' },
    { text: 'MacBook', href: '/products?brand=apple', type: 'brand' },
    { text: 'Laptop Dell', href: '/products?brand=dell', type: 'brand' },
    { text: 'Ultrabook', href: '/products?category=ultrabook', type: 'category' },
    { text: 'Laptop HP', href: '/products?brand=hp', type: 'brand' },
    { text: 'Hỗ trợ khách hàng', href: '/support', type: 'page' },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'category': return 'bg-blue-100 text-blue-800';
      case 'brand': return 'bg-green-100 text-green-800';
      case 'page': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (resultCount > 0) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-6 mt-8">
      <div className="flex items-center mb-4">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          Không tìm thấy kết quả cho "{searchTerm}"
        </h3>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Gợi ý tìm kiếm:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Kiểm tra chính tả của từ khóa</li>
          <li>• Thử sử dụng từ khóa khác hoặc từ khóa tổng quát hơn</li>
          <li>• Sử dụng ít từ khóa hơn</li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Tìm kiếm phổ biến:</h4>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Link
              key={index}
              href={suggestion.href}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium hover:shadow-md transition-all duration-200 ${getTypeColor(suggestion.type)}`}
            >
              {suggestion.text}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Vẫn không tìm thấy sản phẩm mong muốn?{' '}
          <Link href="/contact" className="text-blue-600 hover:underline">
            Liên hệ với chúng tôi
          </Link>{' '}
          để được hỗ trợ.
        </p>
      </div>
    </div>
  );
};

export default SearchHelp;
