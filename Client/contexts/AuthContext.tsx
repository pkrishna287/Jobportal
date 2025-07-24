import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiCall } from '../lib/fetch';

export type UserRole = 'user' | 'admin' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  location?: string;
  company?: string;
  position?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isUser: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing token and validate user on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const currentUser = await apiCall('/auth/me');
          setUser(currentUser);
        } catch (error) {
          console.error('Failed to validate token:', error);
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    if (!role || !email || !password) {
      setError('Please fill in all fields');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, role })
      });

      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('auth_token', response.token);
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Login failed:', error);

      // Determine error message based on error type
      let errorMessage = 'Login failed';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('Network error')) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          errorMessage = 'Invalid email or password';
        } else if (error.message.includes('400')) {
          errorMessage = 'Invalid request. Please check your credentials.';
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiCall('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      setError(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
