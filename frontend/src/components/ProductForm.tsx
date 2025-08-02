import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { Product } from '../types';
import { CreateProductData } from '../services/productService';
import categoriesService from '../services/categoriesService';
import productService from '../services/productService';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface ExtendedProductData extends CreateProductData {
  image: string;
  stockQuantity: number;
  status: 'active' | 'inactive';
  isNew?: boolean;
  isHot?: boolean;
  isSale?: boolean;
  specs?: Record<string, any>;
  shortDescription: string;
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductData) => Promise<void>;
  product?: Product | null;
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  isLoading = false
}) => {
  // Optimized version with enhanced styling
  const [formData, setFormData] = useState<ExtendedProductData>({
    name: '',
    description: '',
    shortDescription: '',
    price: 0,
    originalPrice: 0,
    image: '',
    images: [],
    category: '',
    brand: '',
    stock: 0,
    stockQuantity: 0,
    isNew: false,
    isHot: false,
    isSale: false,
    status: 'active',
    specs: {
      processor: '',
      ram: '',
      storage: '',
      graphics: '',
      display: '',
      battery: '',
      weight: '',
      screenSize: '',
      resolution: '',
      os: '',
      ports: [],
      features: []
    }
  });
  
  const [imagePreview, setImagePreview] = useState<string>('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);

  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await categoriesService.getCategories();
        if (response && Array.isArray(response)) {
          setCategories(response);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Load brands from API  
  useEffect(() => {
    const loadBrands = async () => {
      try {
        setLoadingBrands(true);
        console.log('🔄 Loading brands from API...');
        // Use public API endpoint instead of admin endpoint
        const response = await productService.getBrands();
        console.log('🎯 Brands API response:', response);
        if (response && Array.isArray(response)) {
          setBrands(response);
          console.log('✅ Brands set:', response);
        } else {
          console.log('⚠️ Invalid brands response, using fallback');
          // Fallback to default brands if API fails
          setBrands(['Apple', 'Dell', 'HP', 'Asus', 'Lenovo', 'MSI', 'Acer', 'LG', 'Gigabyte', 'Razer']);
        }
      } catch (error) {
        console.error('❌ Error loading brands:', error);
        // Fallback to default brands if API fails
        setBrands(['Apple', 'Dell', 'HP', 'Asus', 'Lenovo', 'MSI', 'Acer', 'LG', 'Gigabyte', 'Razer']);
      } finally {
        setLoadingBrands(false);
      }
    };

    loadBrands();
  }, []);

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        shortDescription: (product as any).shortDescription || product.description.substring(0, 150),
        price: product.price,
        originalPrice: product.originalPrice || 0,
        image: product.image,
        images: product.images || [],
        category: typeof product.category === 'string' ? product.category : (product.category as any)?.name || '',
        brand: product.brand,
        stock: product.stock,
        stockQuantity: product.stockQuantity,
        isNew: product.isNew || false,
        isHot: product.isHot || false,
        isSale: product.isSale || false,
        status: product.status,
        specs: product.specifications || product.specs || {
          processor: '',
          ram: '',
          storage: '',
          graphics: '',
          display: '',
          battery: '',
          weight: '',
          screenSize: '',
          resolution: '',
          os: '',
          ports: [],
          features: []
        }
      });
      setImagePreview(product.image);
      setAdditionalImages(product.images || []);
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        price: 0,
        originalPrice: 0,
        image: '',
        images: [],
        category: '',
        brand: '',
        stock: 0,
        stockQuantity: 0,
        isNew: false,
        isHot: false,
        isSale: false,
        status: 'active',
        specs: {
          processor: '',
          ram: '',
          storage: '',
          graphics: '',
          display: '',
          battery: '',
          weight: '',
          screenSize: '',
          resolution: '',
          os: '',
          ports: [],
          features: []
        }
      });
      setImagePreview('');
      setAdditionalImages([]);
    }
    setErrors({});
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name.startsWith('specs.')) {
      const specKey = name.split('.')[1];
      if (specKey === 'ports' || specKey === 'features') {
        // Handle array fields
        setFormData(prev => ({
          ...prev,
          specs: {
            ...prev.specs!,
            [specKey]: value
          }
        }));
      } else {
        // Handle string fields
        setFormData(prev => ({
          ...prev,
          specs: {
            ...prev.specs!,
            [specKey]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setImagePreview(imageUrl);
        };
        reader.readAsDataURL(file);

        // Upload to Cloudinary via backend
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        formDataUpload.append('folder', 'products');

        const response = await fetch('http://localhost:3001/api/upload/image', {
          method: 'POST',
          body: formDataUpload,
        });

        if (response.ok) {
          const result = await response.json();
          const cloudinaryUrl = result.data.url;
          
          setFormData(prev => ({
            ...prev,
            image: cloudinaryUrl,
            images: [cloudinaryUrl, ...(prev.images || []).slice(1)]
          }));
        } else {
          console.error('Failed to upload image');
          // Fallback to base64 for preview
          const reader2 = new FileReader();
          reader2.onload = (e) => {
            const imageUrl = e.target?.result as string;
            setFormData(prev => ({
              ...prev,
              image: imageUrl
            }));
          };
          reader2.readAsDataURL(file);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        // Fallback to base64
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setFormData(prev => ({
            ...prev,
            image: imageUrl
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      try {
        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setAdditionalImages(prev => [...prev, imageUrl]);
        };
        reader.readAsDataURL(file);

        // Upload to Cloudinary via backend
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        formDataUpload.append('folder', 'products');

        const response = await fetch('http://localhost:3001/api/upload/image', {
          method: 'POST',
          body: formDataUpload,
        });

        if (response.ok) {
          const result = await response.json();
          const cloudinaryUrl = result.data.url;
          
          setFormData(prev => ({
            ...prev,
            images: [...(prev.images || []), cloudinaryUrl]
          }));
        } else {
          console.error('Failed to upload additional image');
          // Fallback to base64
          const reader2 = new FileReader();
          reader2.onload = (e) => {
            const imageUrl = e.target?.result as string;
            setFormData(prev => ({
              ...prev,
              images: [...(prev.images || []), imageUrl]
            }));
          };
          reader2.readAsDataURL(file);
        }
      } catch (error) {
        console.error('Error uploading additional image:', error);
        // Fallback to base64
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setAdditionalImages(prev => [...prev, imageUrl]);
          setFormData(prev => ({
            ...prev,
            images: [...(prev.images || []), imageUrl]
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Tên sản phẩm là bắt buộc';
    }
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = 'Mô tả sản phẩm là bắt buộc';
    }
    if (!formData.shortDescription || !formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Mô tả ngắn là bắt buộc';
    } else if (formData.shortDescription.length > 150) {
      newErrors.shortDescription = 'Mô tả ngắn không được vượt quá 150 ký tự';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Giá sản phẩm phải lớn hơn 0';
    }
    if (!formData.category || !formData.category.trim()) {
      newErrors.category = 'Danh mục là bắt buộc';
    }
    if (!formData.brand || !formData.brand.trim()) {
      newErrors.brand = 'Thương hiệu là bắt buộc';
    }
    if ((formData.stockQuantity || 0) < 0) {
      newErrors.stockQuantity = 'Số lượng tồn kho không được âm';
    }
    // Image is optional now - will use placeholder if empty

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare data for submission
      const submitData: CreateProductData = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: formData.price,
        originalPrice: formData.originalPrice || undefined,
        images: formData.images || [],
        category: formData.category,
        brand: formData.brand,
        stock: formData.stockQuantity || formData.stock || 0,
        specifications: formData.specs,
        tags: [],
        isFeatured: formData.isHot || false,
        isOnSale: formData.isSale || false
      };

      console.log('Submitting product data:', submitData);
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 px-6 pt-6 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Thông tin cơ bản</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tên sản phẩm *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Nhập tên sản phẩm"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mô tả *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Nhập mô tả sản phẩm"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mô tả ngắn *
                    </label>
                    <textarea
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      rows={2}
                      maxLength={150}
                      className={`w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.shortDescription ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Nhập mô tả ngắn (tối đa 150 ký tự)"
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.shortDescription && <p className="text-red-500 text-sm">{errors.shortDescription}</p>}
                      <p className="text-gray-500 text-xs ml-auto">{formData.shortDescription.length}/150</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Giá bán *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                          errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="0"
                      />
                      {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Giá gốc
                      </label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Danh mục *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        disabled={loadingCategories}
                        className={`w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                          errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <option value="">
                          {loadingCategories ? 'Đang tải danh mục...' : 'Chọn danh mục'}
                        </option>
                        {categories.map((category) => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Thương hiệu *
                      </label>
                      <select
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        disabled={loadingBrands}
                        className={`w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                          errors.brand ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <option value="">
                          {loadingBrands ? 'Đang tải thương hiệu...' : 'Chọn thương hiệu'}
                        </option>
                        {brands.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                      </select>
                      {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Số lượng tồn kho *
                      </label>
                      <input
                        type="number"
                        name="stockQuantity"
                        value={formData.stockQuantity}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                          errors.stockQuantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="0"
                      />
                      {errors.stockQuantity && <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Trạng thái
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Tạm dừng</option>
                        <option value="out_of_stock">Hết hàng</option>
                      </select>
                    </div>
                  </div>

                  {/* Product Flags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nhãn sản phẩm
                    </label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="isNew"
                          checked={formData.isNew}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Sản phẩm mới</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="isHot"
                          checked={formData.isHot}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Sản phẩm hot</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="isSale"
                          checked={formData.isSale}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Đang sale</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Images and Specifications */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Hình ảnh & Thông số</h4>
                  
                  {/* Main Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ảnh chính *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      {imagePreview ? (
                        <div className="relative">
                          <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview('');
                              setFormData(prev => ({ ...prev, image: '' }));
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-2">
                            <label className="cursor-pointer">
                              <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Tải lên ảnh chính
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                  </div>

                  {/* Additional Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ảnh phụ
                    </label>
                    <div className="space-y-2">
                      {additionalImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img src={image} alt={`Additional ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <TrashIcon className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <label className="cursor-pointer block">
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-gray-400">
                          <PlusIcon className="mx-auto h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">Thêm ảnh</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleAdditionalImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Thông số kỹ thuật
                    </label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="specs.processor"
                        value={formData.specs?.processor || ''}
                        onChange={handleInputChange}
                        placeholder="Bộ xử lý"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        name="specs.ram"
                        value={formData.specs?.ram || ''}
                        onChange={handleInputChange}
                        placeholder="RAM"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        name="specs.storage"
                        value={formData.specs?.storage || ''}
                        onChange={handleInputChange}
                        placeholder="Bộ nhớ"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        name="specs.graphics"
                        value={formData.specs?.graphics || ''}
                        onChange={handleInputChange}
                        placeholder="Card đồ họa"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        name="specs.display"
                        value={formData.specs?.display || ''}
                        onChange={handleInputChange}
                        placeholder="Màn hình"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        name="specs.battery"
                        value={formData.specs?.battery || ''}
                        onChange={handleInputChange}
                        placeholder="Pin"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        name="specs.weight"
                        value={formData.specs?.weight || ''}
                        onChange={handleInputChange}
                        placeholder="Trọng lượng"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        name="specs.screenSize"
                        value={(formData.specs as any)?.screenSize || ''}
                        onChange={handleInputChange}
                        placeholder="Kích thước màn hình (ví dụ: 15.6 inch)"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        name="specs.resolution"
                        value={(formData.specs as any)?.resolution || ''}
                        onChange={handleInputChange}
                        placeholder="Độ phân giải (ví dụ: 1920x1080)"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        name="specs.os"
                        value={(formData.specs as any)?.os || ''}
                        onChange={handleInputChange}
                        placeholder="Hệ điều hành (ví dụ: Windows 11)"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        name="specs.ports"
                        value={(formData.specs as any)?.ports ? (formData.specs as any).ports.join(', ') : ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          const portsArray = value.split(',').map(port => port.trim()).filter(port => port.length > 0);
                          handleInputChange({
                            target: {
                              name: 'specs.ports',
                              value: portsArray
                            }
                          } as any);
                        }}
                        placeholder="Cổng kết nối (phân cách bằng dấu phẩy)"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        name="specs.features"
                        value={(formData.specs as any)?.features ? (formData.specs as any).features.join(', ') : ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          const featuresArray = value.split(',').map(feature => feature.trim()).filter(feature => feature.length > 0);
                          handleInputChange({
                            target: {
                              name: 'specs.features',
                              value: featuresArray
                            }
                          } as any);
                        }}
                        placeholder="Tính năng đặc biệt (phân cách bằng dấu phẩy)"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-5 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center rounded-xl border border-transparent shadow-sm px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-base font-medium text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:ml-4 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    {product ? (
                      <>
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Cập nhật
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Thêm mới
                      </>
                    )}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center items-center rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm px-6 py-3 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
