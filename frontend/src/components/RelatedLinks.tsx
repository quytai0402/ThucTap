import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface RelatedLink {
  title: string;
  href: string;
  description?: string;
  icon?: string;
}

interface RelatedLinksProps {
  title?: string;
  links: RelatedLink[];
  className?: string;
}

const RelatedLinks: React.FC<RelatedLinksProps> = ({ 
  title = "Liên kết liên quan", 
  links, 
  className = "" 
}) => {
  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="group flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center">
              {link.icon && (
                <span className="text-xl mr-3">{link.icon}</span>
              )}
              <div>
                <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                  {link.title}
                </h4>
                {link.description && (
                  <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                )}
              </div>
            </div>
            <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedLinks;
