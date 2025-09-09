'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authApi, type User, type LoginRequest, type RegisterRequest, type ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest } from '@/lib/api/auth';
import fetcher from '@/lib/fetcher';
import { useRouter, useSearchParams } from 'next/navigation';

// Auth context types
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  refreshUser: () => Promise<void>;
  checkEmailAvailability: (email: string) => Promise<boolean>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
}

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if user is authenticated
  const isAuthenticated = !!user && isMounted && fetcher.isAuthenticated();

  // Role helper functions
  const hasRole = useCallback((role: string): boolean => {
    if (!user?.roles) return false;
    return user.roles.includes(role);
  }, [user]);

  const hasAnyRole = useCallback((roles: string[]): boolean => {
    if (!user?.roles) return false;
    return roles.some(role => user.roles!.includes(role));
  }, [user]);

  const hasAllRoles = useCallback((roles: string[]): boolean => {
    if (!user?.roles) return false;
    return roles.every(role => user.roles!.includes(role));
  }, [user]);

  // Initialize auth state
  useEffect(() => {
    setIsMounted(true);

    const initializeAuth = async () => {
      try {
        // Kiểm tra nếu có access token trong localStorage
        if (typeof window !== 'undefined' && fetcher.isAuthenticated()) {
          // Lấy thông tin user từ server
          const response = await authApi.getMe();
          setUser(response.user);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Nếu token không hợp lệ, clear nó
        if (typeof window!== 'undefined') {
          fetcher.logout();
        }
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    if (isMounted) {
      initializeAuth();
    }
  }, [isMounted]);

  // Handle redirect after authentication state is initialized
  useEffect(() => {
    if (!isInitialized || isLoading) return;

    const currentPath = window.location.pathname;
    const redirectParam = searchParams.get('redirect');

    // Nếu đã đăng nhập và đang ở trang auth
    if (isAuthenticated && currentPath.startsWith('/auth/')) {
      const redirectTo = redirectParam || '/admin/default';
      router.replace(redirectTo);
      return;
    }

    // Nếu chưa đăng nhập và đang ở protected route
    const protectedRoutes = ['/admin', '/dashboard', '/account', '/wallet'];
    if (!isAuthenticated && protectedRoutes.some(route => currentPath.startsWith(route))) {
      const signInUrl = `/auth/sign-in${currentPath !== '/' ? `?redirect=${encodeURIComponent(currentPath)}` : ''}`;
      router.replace(signInUrl);
      return;
    }

    // Redirect root path
    if (currentPath === '/') {
      if (isAuthenticated) {
        router.replace('/admin/default');
      } else {
        router.replace('/auth/sign-in');
      }
    }
  }, [isAuthenticated, isInitialized, isLoading, router, searchParams]);

  // Login function
  const login = useCallback(async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(data);
      setUser(response.user);
    } catch (error) {
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
      if (typeof window!== 'undefined') {
        fetcher.logout(); // Clear local tokens
        window.location.href = '/auth/sign-in';
      }
      setIsLoading(false);
    }
  }, []);

  // Change password function
  const changePassword = useCallback(async (data: ChangePasswordRequest) => {
    try {
      setIsLoading(true);
      await authApi.changePassword(data);
    } catch (error) {
      console.error('Change password failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Forgot password function
  const forgotPassword = useCallback(async (data: ForgotPasswordRequest) => {
    try {
      setIsLoading(true);
      await authApi.forgotPassword(data);
    } catch (error) {
      console.error('Forgot password failed:', error);
      throw error;
    }  finally {
      setIsLoading(false);
    }
  }, []);

  // Reset password function
  const resetPassword = useCallback(async (data: ResetPasswordRequest) => {
    try {
      setIsLoading(true);
      await authApi.resetPassword(data);
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && fetcher.isAuthenticated()) {
        setIsLoading(true);
        const response = await authApi.getMe();
        setUser(response.user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // Nếu không thể refresh, có thể token đã hết hạn
      setUser(null);
      if (typeof window!== 'undefined') {
        fetcher.logout();
      }
      throw error;
    } finally {
      setIsLoading(false);
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
    isInitialized,
    login,
    register,
    logout,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshUser,
    checkEmailAvailability,
    checkUsernameAvailability,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Export context and types
export { AuthContext };
export type { AuthContextType, User, LoginRequest, RegisterRequest, ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest };