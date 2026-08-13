import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface SavedDeliveryInfo {
  phone: string;
  address: string;
  wilaya: string;
  deliveryType: 'home' | 'pickup';
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  deliveryInfo?: SavedDeliveryInfo;
  wishlist?: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateDeliveryInfo: (info: SavedDeliveryInfo) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  updateAccountInfo: (name: string, email: string) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'drippy_auth_user';
const API_BASE = 'http://127.0.0.1:5000';

function getLocalExtras(userId: string): { deliveryInfo?: SavedDeliveryInfo; wishlist?: string[] } {
  try {
    const stored = localStorage.getItem(`drippy_user_extras_${userId}`);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function setLocalExtras(userId: string, extras: { deliveryInfo?: SavedDeliveryInfo; wishlist?: string[] }) {
  localStorage.setItem(`drippy_user_extras_${userId}`, JSON.stringify(extras));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please try again.');
      }

      const extras = getLocalExtras(String(data.id));
      setUser({
        id: String(data.id),
        name: data.name,
        email: data.email,
        deliveryInfo: extras.deliveryInfo,
        wishlist: extras.wishlist,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }

      setUser({
        id: String(data.id),
        name: data.name,
        email: data.email,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateDeliveryInfo = (info: SavedDeliveryInfo) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, deliveryInfo: info };
      setLocalExtras(prev.id, { deliveryInfo: info, wishlist: prev.wishlist });
      return updated;
    });
  };

  const toggleWishlist = (productId: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const current = prev.wishlist ?? [];
      const updatedList = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId];
      const updated = { ...prev, wishlist: updatedList };
      setLocalExtras(prev.id, { deliveryInfo: prev.deliveryInfo, wishlist: updatedList });
      return updated;
    });
  };

  const isInWishlist = (productId: string) => {
    return user?.wishlist?.includes(productId) ?? false;
  };

  const updateAccountInfo = (_name: string, _email: string): { success: boolean; error?: string } => {
    // Editing name/email against the real backend isn't wired up yet —
    // would need a PUT /users/<id> endpoint. Left as a follow-up.
    return { success: false, error: 'Account editing is not available yet.' };
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateDeliveryInfo, toggleWishlist, isInWishlist, updateAccountInfo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}