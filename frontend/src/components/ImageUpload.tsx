import React, { useState } from 'react';
import { uploadService } from '../services/uploadService';

interface ImageUploadProps {
  onUpload?: (url: string) => void;
  multiple?: boolean;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onUpload, 
  multiple = false, 
  className = '' 
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setUploading(true);

    try {
      if (multiple) {
        // Validate files
        const validation = uploadService.validateFiles(files);
        if (!validation.valid) {
          setError(validation.errors.join(', '));
          setUploading(false);
          return;
        }

        // Upload multiple files
        const result = await uploadService.uploadImages(files);
        const urls = result.data.map(file => file.url);
        setUploadedUrls(urls);
        
        if (onUpload && urls.length > 0) {
          onUpload(urls[0]); // Return first URL for compatibility
        }
      } else {
        // Single file upload
        const file = files[0];
        
        if (!uploadService.validateImageFile(file)) {
          setError('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.');
          setUploading(false);
          return;
        }

        if (!uploadService.validateFileSize(file)) {
          setError('File size too large. Maximum 5MB allowed.');
          setUploading(false);
          return;
        }

        const result = await uploadService.uploadImage(file);
        const url = result.data.url;
        setUploadedUrls([url]);
        
        if (onUpload) {
          onUpload(url);
        }
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`image-upload ${className}`}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {multiple ? 'Upload Images' : 'Upload Image'}
        </label>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />
      </div>

      {uploading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Uploading...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {uploadedUrls.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</h4>
          <div className={`grid gap-2 ${multiple ? 'grid-cols-3' : 'grid-cols-1'}`}>
            {uploadedUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md border"
                />
                <button
                  onClick={() => {
                    const newUrls = uploadedUrls.filter((_, i) => i !== index);
                    setUploadedUrls(newUrls);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
