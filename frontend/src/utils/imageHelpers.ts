/**
 * Helper functions for handling images
 */

export const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) {
    return '/images/placeholder-product.svg';
  }

  // If it's already a full URL (Cloudinary), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's a relative path, make it absolute
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // Otherwise, add leading slash
  return `/images/${imagePath}`;
};

export const isCloudinaryUrl = (url: string): boolean => {
  return url.includes('res.cloudinary.com');
};

export const getOptimizedImageUrl = (
  originalUrl: string,
  width?: number,
  height?: number,
  quality?: number
): string => {
  if (!isCloudinaryUrl(originalUrl)) {
    return originalUrl;
  }

  try {
    const url = new URL(originalUrl);
    const pathParts = url.pathname.split('/');
    const uploadIndex = pathParts.indexOf('upload');
    
    if (uploadIndex === -1) return originalUrl;

    const transformations: string[] = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (quality) transformations.push(`q_${quality}`);
    
    if (transformations.length > 0) {
      pathParts.splice(uploadIndex + 1, 0, transformations.join(','));
    }

    url.pathname = pathParts.join('/');
    return url.toString();
  } catch (error) {
    console.error('Error optimizing image URL:', error);
    return originalUrl;
  }
};

export const getProductImageUrl = (product: any): string => {
  // Check for main image first
  if (product.image) {
    return getImageUrl(product.image);
  }

  // Check for first image in images array
  if (product.images && product.images.length > 0) {
    return getImageUrl(product.images[0]);
  }

  // Fallback to placeholder
  return '/images/placeholder-product.svg';
};

export const getCategoryImageUrl = (category: any): string => {
  if (category.image) {
    return getImageUrl(category.image);
  }

  return '/images/placeholder.svg';
};
