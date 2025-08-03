import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { productService } from '../services/productService';

// Helper function to safely extract category name
const getCategoryName = (category: any): string => {
  if (typeof category === 'string') return category;
  if (category && typeof category === 'object' && 'name' in category) return category.name;
  return 'Unknown';
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<boolean>;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => Promise<boolean>;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from cookies on mount
    const savedCart = Cookies.get('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from cookies:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save cart to cookies whenever items change
    Cookies.set('cart', JSON.stringify(items), { expires: 7 });
  }, [items]);

  const addItem = async (newItem: Omit<CartItem, 'quantity'>): Promise<boolean> => {
    try {
      // Check current stock
      const product = await productService.getProduct(newItem.id);
      if (!product) {
        console.error('Không thể kiểm tra stock của sản phẩm');
        return false;
      }

      const currentStock = product.stock || 0;
      
      // Check how many of this item are already in cart
      const existingItem = items.find(item => item.id === newItem.id);
      const currentInCart = existingItem ? existingItem.quantity : 0;
      
      // Check if we can add one more
      if (currentInCart >= currentStock) {
        console.warn(`Không thể thêm sản phẩm. Hết hàng! Còn lại: ${currentStock}, trong giỏ: ${currentInCart}`);
        return false;
      }

      // Process category to ensure it's a string
      const processedItem = {
        ...newItem,
        category: getCategoryName(newItem.category)
      };
      
      setItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === processedItem.id);
        
        if (existingItem) {
          return prevItems.map(item =>
            item.id === processedItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevItems, { ...processedItem, quantity: 1 }];
        }
      });

      return true;
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
      return false;
    }
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = async (id: string, quantity: number): Promise<boolean> => {
    if (quantity <= 0) {
      removeItem(id);
      return true;
    }

    try {
      // Check current stock
      const product = await productService.getProduct(id);
      if (!product) {
        console.error('Không thể kiểm tra stock của sản phẩm');
        return false;
      }

      const currentStock = product.stock || 0;
      
      // Check if requested quantity is available
      if (quantity > currentStock) {
        console.warn(`Không thể cập nhật số lượng. Hết hàng! Còn lại: ${currentStock}, yêu cầu: ${quantity}`);
        return false;
      }

      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );

      return true;
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
      return false;
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 