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
  wishlist?: string[]; // array of product UUIDs
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

  /**
   * Login — currently backed by localStorage.
   * Replace the body with a real API call when the backend is ready:
   *
   *   const response = await fetch('/api/auth/login', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify({ email, password }),
   *   });
   *   if (!response.ok) throw new Error('Invalid credentials');
   *   const data = await response.json();
   *   setUser(data.user);
   */
  const login = async (email: string, _password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 900));

      // Check if a registered user exists in localStorage
      const registeredKey = `drippy_registered_${email.toLowerCase()}`;
      const registered = localStorage.getItem(registeredKey);
      if (!registered) throw new Error('No account found with that email. Please register first.');

      const registeredUser = JSON.parse(registered) as { name: string; email: string; id: string; deliveryInfo?: SavedDeliveryInfo; wishlist?: string[] };
      setUser({
        id: registeredUser.id,
        name: registeredUser.name,
        email: registeredUser.email,
        deliveryInfo: registeredUser.deliveryInfo,
        wishlist: registeredUser.wishlist,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register — currently backed by localStorage.
   * Replace the body with a real API call when the backend is ready:
   *
   *   const response = await fetch('/api/auth/register', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify({ name, email, password }),
   *   });
   *   if (!response.ok) throw new Error('Registration failed');
   *   const data = await response.json();
   *   setUser(data.user);
   */
  const register = async (name: string, email: string, _password: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const registeredKey = `drippy_registered_${email.toLowerCase()}`;
      if (localStorage.getItem(registeredKey)) {
        throw new Error('An account with this email already exists.');
      }

      const newUser: AuthUser = {
        id: `user_${Date.now()}`,
        name,
        email,
      };

      localStorage.setItem(registeredKey, JSON.stringify(newUser));
      setUser(newUser);
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
      syncRegisteredRecord(prev.email, { deliveryInfo: info });
      return updated;
    });
  };

  const syncRegisteredRecord = (email: string, patch: Partial<AuthUser>) => {
    const registeredKey = `drippy_registered_${email.toLowerCase()}`;
    const existing = localStorage.getItem(registeredKey);
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        localStorage.setItem(registeredKey, JSON.stringify({ ...parsed, ...patch }));
      } catch {
        // ignore parse errors
      }
    }
  };

  const toggleWishlist = (productId: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const current = prev.wishlist ?? [];
      const updatedList = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId];
      const updated = { ...prev, wishlist: updatedList };
      syncRegisteredRecord(prev.email, { wishlist: updatedList });
      return updated;
    });
  };

  const isInWishlist = (productId: string) => {
    return user?.wishlist?.includes(productId) ?? false;
  };

  const updateAccountInfo = (name: string, email: string): { success: boolean; error?: string } => {
    if (!user) return { success: false, error: 'Not logged in.' };

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName || !trimmedEmail) {
      return { success: false, error: 'Name and email cannot be empty.' };
    }

    const emailChanged = trimmedEmail !== user.email.toLowerCase();

    if (emailChanged) {
      const newKey = `drippy_registered_${trimmedEmail}`;
      if (localStorage.getItem(newKey)) {
        return { success: false, error: 'An account with this email already exists.' };
      }
      // Move the registered record to the new email key
      const oldKey = `drippy_registered_${user.email.toLowerCase()}`;
      const existing = localStorage.getItem(oldKey);
      localStorage.removeItem(oldKey);
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          localStorage.setItem(newKey, JSON.stringify({ ...parsed, name: trimmedName, email: trimmedEmail }));
        } catch {
          localStorage.setItem(newKey, JSON.stringify({ ...user, name: trimmedName, email: trimmedEmail }));
        }
      }
    } else {
      syncRegisteredRecord(user.email, { name: trimmedName });
    }

    setUser((prev) => (prev ? { ...prev, name: trimmedName, email: trimmedEmail } : prev));
    return { success: true };
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
