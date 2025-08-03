import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {/* Home link */}
        <li>
          <Link href="/" className="text-gray-400 hover:text-gray-600">
            <HomeIcon className="h-4 w-4" />
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 text-gray-300 mx-2" />
            {item.href && index < items.length - 1 ? (
              <Link 
                href={item.href}
                className="text-gray-600 hover:text-blue-600 text-sm font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 text-sm font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
