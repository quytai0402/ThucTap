import React, { useState, useRef } from 'react';
import {
  XMarkIcon,
  PhotoIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

interface CategoryFormData {
  name: string;
  description: string;
  sort: number;
  image?: File | null;
  imageUrl?: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  category?: any | null;
  isLoading?: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || '',
    description: category?.description || '',
    sort: category?.sort || 0,
    image: null,
    imageUrl: category?.image || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(category?.image || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof CategoryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear image error
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    } else {
      alert('Vui lòng chọn file hình ảnh (JPG, PNG, GIF, WEBP)');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Tên danh mục là bắt buộc';
    }
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = 'Mô tả danh mục là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error submitting category:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      sort: 0,
      image: null,
      imageUrl: ''
    });
    setErrors({});
    setPreviewUrl('');
    onClose();
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null, imageUrl: '' }));
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên danh mục *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập tên danh mục..."
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập mô tả danh mục..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thứ tự sắp xếp
            </label>
            <input
              type="number"
              value={formData.sort}
              onChange={(e) => handleInputChange('sort', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              min="0"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh danh mục
            </label>
            
            {/* Preview */}
            {previewUrl && (
              <div className="mb-4 relative inline-block">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                Kéo thả hình ảnh vào đây hoặc
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                chọn file
              </button>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, GIF, WEBP (max 10MB)
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              <span>{category ? 'Cập nhật' : 'Thêm mới'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
