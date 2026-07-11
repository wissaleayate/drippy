import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  /** Unique key = `${product.id}-${size}` */
  id: string;
  product: Product;
  quantity: number;
  size: string;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; size: string } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; delta: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; payload: CartItem[] };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'drippy_cart';

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota exceeded or private-browsing restriction — silently ignore.
  }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { items: action.payload };

    case 'ADD_ITEM': {
      const { product, size } = action.payload;
      const itemId = `${product.id}-${size}`;
      const existing = state.items.findIndex((i) => i.id === itemId);
      if (existing > -1) {
        const updated = state.items.map((i, idx) =>
          idx === existing ? { ...i, quantity: i.quantity + 1 } : i
        );
        return { items: updated };
      }
      return {
        items: [...state.items, { id: itemId, product, quantity: 1, size }],
      };
    }

    case 'REMOVE_ITEM':
      return { items: state.items.filter((i) => i.id !== action.payload.itemId) };

    case 'UPDATE_QUANTITY': {
      const { itemId, delta } = action.payload;
      return {
        items: state.items
          .map((i) => (i.id === itemId ? { ...i, quantity: i.quantity + delta } : i))
          .filter((i) => i.quantity > 0),
      };
    }

    case 'CLEAR_CART':
      return { items: [] };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, size?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Hydrate from localStorage on mount
  useEffect(() => {
    const persisted = loadFromStorage();
    if (persisted.length > 0) {
      dispatch({ type: 'HYDRATE', payload: persisted });
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    saveToStorage(state.items);
  }, [state.items]);

  const addItem = useCallback((product: Product, size?: string) => {
    const finalSize = size || product.sizes[0] || 'Free Size';
    dispatch({ type: 'ADD_ITEM', payload: { product, size: finalSize } });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });
  }, []);

  const updateQuantity = useCallback((itemId: string, delta: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, delta } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const itemCount = state.items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = state.items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
