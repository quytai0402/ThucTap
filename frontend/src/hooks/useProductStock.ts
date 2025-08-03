import { useState, useEffect } from 'react';
import productService from '../services/productService';

interface ProductStock {
  id: string;
  stock: number;
  inStock: boolean;
}

export const useProductStock = (productId: string, initialStock?: number) => {
  const [stock, setStock] = useState<number>(initialStock || 0);
  const [inStock, setInStock] = useState<boolean>((initialStock || 0) > 0);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshStock = async () => {
    try {
      setLoading(true);
      const product = await productService.getProduct(productId);
      if (product) {
        const newStock = product.stock || 0;
        setStock(newStock);
        setInStock(newStock > 0);
      }
    } catch (error) {
      console.error('Error fetching product stock:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only refresh if we don't have initial stock data
    if (initialStock === undefined) {
      refreshStock();
    }
  }, [productId, initialStock]);

  return {
    stock,
    inStock,
    loading,
    refreshStock
  };
};

export default useProductStock;
