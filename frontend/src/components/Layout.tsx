import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';
import BackToTop from './BackToTop';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface LayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  showBreadcrumb?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, breadcrumbs, showBreadcrumb = false }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {showBreadcrumb && breadcrumbs && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumb items={breadcrumbs} />
          </div>
        </div>
      )}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Layout; 