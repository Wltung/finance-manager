'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authApi, type User, type LoginRequest, type RegisterRequest, type ChangePasswordRequest } from '@/lib/api/auth';
import fetcher from '@/lib/fetcher';

// Auth context types
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  refreshUser: () => Promise<void>;
  checkEmailAvailability: (email: string) => Promise<boolean>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = !!user && fetcher.isAuthenticated();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Kiểm tra nếu có access token trong localStorage
        if (fetcher.isAuthenticated()) {
          // Lấy thông tin user từ server
          const response = await authApi.getMe();
          setUser(response.user);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Nếu token không hợp lệ, clear nó
        fetcher.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(data);
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await authApi.register(data);
      setUser(response.user);
    } catch (error) {
      console.error('Register failed:', error);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Vẫn clear state local dù API call fail
    } finally {
      setUser(null);
      fetcher.logout(); // Clear local tokens
      setIsLoading(false);
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
  }, []);

  // Change password function
  const changePassword = useCallback(async (data: ChangePasswordRequest) => {
    try {
      await authApi.changePassword(data);
    } catch (error) {
      console.error('Change password failed:', error);
      throw error;
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      if (fetcher.isAuthenticated()) {
        const response = await authApi.getMe();
        setUser(response.user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // Nếu không thể refresh, có thể token đã hết hạn
      setUser(null);
      fetcher.logout();
      throw error;
    }
  }, []);

  // Check email availability
  const checkEmailAvailability = useCallback(async (email: string): Promise<boolean> => {
    try {
      const response = await authApi.checkEmailAvailability(email);
      return response.available;
    } catch (error) {
      console.error('Check email availability failed:', error);
      throw error;
    }
  }, []);

  // Check username availability
  const checkUsernameAvailability = useCallback(async (username: string): Promise<boolean> => {
    try {
      const response = await authApi.checkUsernameAvailability(username);
      return response.available;
    } catch (error) {
      console.error('Check username availability failed:', error);
      throw error;
    }
  }, []);

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    changePassword,
    refreshUser,
    checkEmailAvailability,
    checkUsernameAvailability,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Export context and types
export { AuthContext };
export type { AuthContextType, User, LoginRequest, RegisterRequest, ChangePasswordRequest };