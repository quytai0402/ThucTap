import api from '../utils/api';

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
    size: number;
  };
}

export interface MultipleUploadResponse {
  success: boolean;
  message: string;
  data: Array<{
    url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
    size: number;
  }>;
}

class UploadService {
  // Upload single image to Cloudinary
  async uploadImage(file: File, folder?: string): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      if (folder) {
        formData.append('folder', folder);
      }
      
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Upload multiple images to Cloudinary
  async uploadImages(files: FileList | File[], folder?: string): Promise<MultipleUploadResponse> {
    try {
      const formData = new FormData();
      
      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });
      
      if (folder) {
        formData.append('folder', folder);
      }
      
      const response = await api.post('/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  }

  // Delete image from Cloudinary
  async deleteImage(publicId: string): Promise<any> {
    try {
      const response = await api.post('/upload/delete', { public_id: publicId });
      return response.data;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  // Delete multiple images from Cloudinary
  async deleteImages(publicIds: string[]): Promise<any> {
    try {
      const response = await api.post('/upload/delete-multiple', { public_ids: publicIds });
      return response.data;
    } catch (error) {
      console.error('Error deleting images:', error);
      throw error;
    }
  }

  // Validate file type
  validateImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return allowedTypes.includes(file.type);
  }

  // Validate file size (5MB limit)
  validateFileSize(file: File, maxSizeMB: number = 5): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  // Validate multiple files
  validateFiles(files: FileList | File[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    Array.from(files).forEach((file, index) => {
      if (!this.validateImageFile(file)) {
        errors.push(`File ${index + 1}: Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.`);
      }
      
      if (!this.validateFileSize(file)) {
        errors.push(`File ${index + 1}: File size too large. Maximum 5MB allowed.`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const uploadService = new UploadService();
export default uploadService;
