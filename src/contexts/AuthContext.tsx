import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/auth';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'child' | 'parent' | 'teacher' | 'admin';
  children?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<User>;
  logout: () => void;
  createChild: (childData: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            // Verify token is still valid by fetching current user
            const userData = await authService.getCurrentUser();
            setUser(userData.user);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid data
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      setUser(response.user);
      setIsAuthenticated(true);
      return response.user;
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any): Promise<User> => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      // Auto-login after registration
      if (response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      return response.user;
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const createChild = async (childData: any): Promise<any> => {
    try {
      const response = await authService.createChild(childData);
      // Refresh user data to get updated linked children
      const userData = await authService.getCurrentUser();
      setUser(userData.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateUser = (updatedUser: any) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    createChild,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
