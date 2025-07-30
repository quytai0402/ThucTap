import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import AdminLayout from '../../src/components/AdminLayout';
import CategoryModal from '../../src/components/CategoryModal';
import api from '../../src/utils/api';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  isActive: boolean;
  productCount: number;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

const CategoriesPage: NextPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        // Update existing category
        if (formData.image) {
          // Upload image first
          const imageFormData = new FormData();
          imageFormData.append('image', formData.image);
          
          await api.post(`/admin/categories/${editingCategory._id}/upload-image`, imageFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
        
        // Update category data
        await api.patch(`/admin/categories/${editingCategory._id}`, {
          name: formData.name,
          description: formData.description,
          sort: formData.sort
        });
      } else {
        // Create new category
        if (formData.image) {
          // Create with image
          const imageFormData = new FormData();
          imageFormData.append('name', formData.name);
          imageFormData.append('description', formData.description);
          imageFormData.append('sort', formData.sort.toString());
          imageFormData.append('image', formData.image);
          
          await api.post('/admin/categories/create-with-image', imageFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else {
          // Create without image
          await api.post('/admin/categories', {
            name: formData.name,
            description: formData.description,
            sort: formData.sort,
            imageUrl: formData.imageUrl
          });
        }
      }
      
      await fetchCategories();
      setShowModal(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error submitting category:', error);
      alert('Có lỗi xảy ra khi lưu danh mục');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
    
    try {
      await api.delete(`/admin/categories/${id}`);
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Có lỗi xảy ra khi xóa danh mục');
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/categories/${id}`, {
        isActive: !currentStatus
      });
      await fetchCategories();
    } catch (error) {
      console.error('Error updating category status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
            <p className="text-gray-600">Tạo và quản lý các danh mục sản phẩm</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Thêm danh mục</span>
          </button>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hình ảnh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thứ tự
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <PhotoIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    <div className="text-sm text-gray-500">{category.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {category.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{category.productCount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(category._id, category.isActive)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        category.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {category.isActive ? (
                        <>
                          <EyeIcon className="w-3 h-3 mr-1" />
                          Hiển thị
                        </>
                      ) : (
                        <>
                          <EyeSlashIcon className="w-3 h-3 mr-1" />
                          Ẩn
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.sort}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có danh mục nào</h3>
              <p className="mt-1 text-sm text-gray-500">
                Bắt đầu bằng cách tạo danh mục đầu tiên.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAdd}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Thêm danh mục
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCategory(null);
        }}
        onSubmit={handleCategorySubmit}
        category={editingCategory}
        isLoading={isSubmitting}
      />
    </AdminLayout>
  );
};

export default CategoriesPage;