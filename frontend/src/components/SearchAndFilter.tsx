import React, { useState, useEffect, useCallback } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  ChevronDownIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';
import { debounce } from 'lodash';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiSelect' | 'range' | 'date' | 'text';
  options?: FilterOption[];
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface SearchAndFilterProps {
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filters: Record<string, any>) => void;
  onReset?: () => void;
  initialValues?: Record<string, any>;
  showFilterCount?: boolean;
  compact?: boolean;
  className?: string;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchPlaceholder = "Tìm kiếm...",
  filters = [],
  onSearch,
  onFilterChange,
  onReset,
  initialValues = {},
  showFilterCount = true,
  compact = false,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValues.search || '');
  const [filterValues, setFilterValues] = useState<Record<string, any>>(initialValues);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      onSearch(term);
    }, 300),
    [onSearch]
  );

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filterValues, [key]: value };
    setFilterValues(newFilters);
    onFilterChange(newFilters);
  };

  // Handle reset
  const handleReset = () => {
    setSearchTerm('');
    setFilterValues({});
    setShowFilters(false);
    onSearch('');
    onFilterChange({});
    if (onReset) onReset();
  };

  // Count active filters
  useEffect(() => {
    const count = Object.values(filterValues).filter(value => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== null && value !== undefined;
    }).length;
    setActiveFiltersCount(count);
  }, [filterValues]);

  // Render filter input based on type
  const renderFilterInput = (filter: FilterConfig) => {
    const value = filterValues[filter.key] || '';

    switch (filter.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">{filter.placeholder || `Tất cả ${filter.label.toLowerCase()}`}</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} {option.count ? `(${option.count})` : ''}
              </option>
            ))}
          </select>
        );

      case 'multiSelect':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={(value as string[])?.includes(option.value) || false}
                  onChange={(e) => {
                    const currentValues = (value as string[]) || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter(v => v !== option.value);
                    handleFilterChange(filter.key, newValues);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {option.label} {option.count ? `(${option.count})` : ''}
                </span>
              </label>
            ))}
          </div>
        );

      case 'range':
        return (
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder={`Từ ${filter.min || 0}`}
              value={(value as any)?.min || ''}
              onChange={(e) => handleFilterChange(filter.key, { 
                ...value, 
                min: e.target.value ? Number(e.target.value) : undefined 
              })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              min={filter.min}
              max={filter.max}
            />
            <input
              type="number"
              placeholder={`Đến ${filter.max || ''}`}
              value={(value as any)?.max || ''}
              onChange={(e) => handleFilterChange(filter.key, { 
                ...value, 
                max: e.target.value ? Number(e.target.value) : undefined 
              })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              min={filter.min}
              max={filter.max}
            />
          </div>
        );

      case 'date':
        return (
          <div className="flex space-x-2">
            <input
              type="date"
              value={(value as any)?.from || ''}
              onChange={(e) => handleFilterChange(filter.key, { 
                ...value, 
                from: e.target.value 
              })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <input
              type="date"
              value={(value as any)?.to || ''}
              onChange={(e) => handleFilterChange(filter.key, { 
                ...value, 
                to: e.target.value 
              })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        );

      case 'text':
        return (
          <input
            type="text"
            placeholder={filter.placeholder}
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        );

      default:
        return null;
    }
  };

  if (compact) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Compact Search & Filter Bar */}
        <div className="flex space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          {filters.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Lọc</span>
              {showFilterCount && activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          )}

          {/* Reset Button */}
          {(searchTerm || activeFiltersCount > 0) && (
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowPathIcon className="h-5 w-5" />
              <span>Đặt lại</span>
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && filters.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filters.map((filter) => (
                <div key={filter.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {filter.label}
                  </label>
                  {renderFilterInput(filter)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        />
      </div>

      {/* Filters */}
      {filters.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Bộ lọc</h3>
            <div className="flex items-center space-x-4">
              {showFilterCount && activeFiltersCount > 0 && (
                <span className="text-sm text-gray-600">
                  {activeFiltersCount} bộ lọc đang áp dụng
                </span>
              )}
              {(searchTerm || activeFiltersCount > 0) && (
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  <span>Đặt lại tất cả</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {filter.label}
                </label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
