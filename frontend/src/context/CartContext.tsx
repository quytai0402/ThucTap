import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

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
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
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

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
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
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
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