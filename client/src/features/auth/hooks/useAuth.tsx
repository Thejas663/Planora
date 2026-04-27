import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@/types/index';
import { authService } from '@/features/auth/services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('planora_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('planora_token')
  );
  const [isLoading, setIsLoading] = useState(false);

  const saveAuth = (authToken: string, authUser: User) => {
    localStorage.setItem('planora_token', authToken);
    localStorage.setItem('planora_user', JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
  };

  const clearAuth = () => {
    localStorage.removeItem('planora_token');
    localStorage.removeItem('planora_user');
    setToken(null);
    setUser(null);
  };

  // Verify token on mount
  useEffect(() => {
    if (token && !user) {
      setIsLoading(true);
      authService
        .getMe()
        .then(setUser)
        .catch(clearAuth)
        .finally(() => setIsLoading(false));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { token: authToken, user: authUser } = await authService.login(email, password);
      saveAuth(authToken, authUser);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { token: authToken, user: authUser } = await authService.signup(name, email, password);
      saveAuth(authToken, authUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, isAuthenticated: !!token && !!user, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
