import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  ChartBarIcon, 
  UsersIcon, 
  CubeIcon, 
  ShoppingCartIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  BuildingStorefrontIcon,
  ChartPieIcon,
  ClipboardDocumentListIcon,
  PresentationChartLineIcon,
  TruckIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Check for saved theme or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      icon: ChartBarIcon,
      description: 'Tổng quan hệ thống'
    },
    { 
      name: 'Phân tích', 
      href: '/admin/analytics', 
      icon: PresentationChartLineIcon,
      description: 'Báo cáo & thống kê'
    },
    { 
      name: 'Sản phẩm', 
      href: '/admin/products', 
      icon: CubeIcon,
      description: 'Quản lý sản phẩm'
    },
    { 
      name: 'Danh mục', 
      href: '/admin/categories', 
      icon: ClipboardDocumentListIcon,
      description: 'Quản lý danh mục'
    },
    { 
      name: 'Đơn hàng', 
      href: '/admin/orders', 
      icon: ShoppingCartIcon,
      description: 'Quản lý đơn hàng'
    },
    { 
      name: 'Khách hàng', 
      href: '/admin/customers', 
      icon: UsersIcon,
      description: 'Quản lý khách hàng'
    },
    { 
      name: 'Kho hàng', 
      href: '/admin/inventory', 
      icon: CubeIcon,
      description: 'Quản lý tồn kho'
    },
    { 
      name: 'Vận chuyển', 
      href: '/admin/shipping', 
      icon: TruckIcon,
      description: 'Quản lý vận chuyển'
    },
    { 
      name: 'Cài đặt', 
      href: '/admin/settings', 
      icon: CogIcon,
      description: 'Cấu hình hệ thống'
    },
  ];

  useEffect(() => {
    // Chỉ redirect khi đã hoàn thành verify token và không phải admin
    if (isClient && !isLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, router, isClient, isLoading]);

  // Hiển thị loading spinner khi đang verify authentication
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // Sẽ redirect trong useEffect
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
          </div>
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 shadow-2xl transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
          
          {/* Logo section */}
          <div className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
            <div className="flex items-center">
              <BuildingStorefrontIcon className="h-8 w-8 text-white mr-3" />
              <div>
                <h1 className="text-white text-xl font-bold">TechStore</h1>
                <p className="text-blue-200 text-sm">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-white hover:bg-blue-700 p-2 rounded-lg"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="mt-4 px-4 space-y-1">
            {navigation.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`mr-4 h-6 w-6 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      {item.name === 'Đơn hàng' && notifications > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {notifications}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${
                      isActive ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5 text-yellow-500" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:ml-72">
          {/* Header */}
          <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden mr-4 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title || navigation.find(item => item.href === router.pathname)?.name || 'Admin'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {navigation.find(item => item.href === router.pathname)?.description || 'Quản lý hệ thống'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="hidden md:flex relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  <BellIcon className="h-6 w-6" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>

                {/* User menu */}
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <span className="hidden md:block mr-2">Xin chào,</span>
                  <span className="font-semibold">{user.name}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 