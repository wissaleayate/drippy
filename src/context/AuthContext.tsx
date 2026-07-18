import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
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

      const registeredUser = JSON.parse(registered) as { name: string; email: string; id: string };
      setUser({
        id: registeredUser.id,
        name: registeredUser.name,
        email: registeredUser.email,
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

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
