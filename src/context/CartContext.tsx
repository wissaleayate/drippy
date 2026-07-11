import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Product } from '../types';

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size: string;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, size?: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string, name: string) => void;
  clearCart: () => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product, size: string = '') => {
    const finalSize = size || product.sizes[0] || 'Free Size';
    const cartItemId = `${product.id}-${finalSize}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prevCart, { id: cartItemId, product, quantity: 1, size: finalSize }];
    });

    showToast(`Added ${product.name} (${finalSize}) to your bag`);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === itemId) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (itemId: string, name: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    showToast(`Removed ${name} from your bag`);
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, isCartOpen, openCart, closeCart, addToCart, updateQuantity, removeFromCart, clearCart, toastMessage, showToast }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}