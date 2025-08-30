'use client';

import { useContext, useEffect } from 'react';
import { AuthContext, type AuthContextType } from '@/contexts/AuthContext';

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for protected routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading, user };
}

// Hook for guest routes (redirect if already authenticated)
export function useGuestOnly() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect to dashboard if already authenticated
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
}

// Hook for authentication status only (without redirects)
export function useAuthStatus() {
  const { isAuthenticated, isLoading, user } = useAuth();
  return { isAuthenticated, isLoading, user };
}

// Hook for login functionality
export function useLogin() {
  const { login, isLoading } = useAuth();
  return { login, isLoading };
}

// Hook for register functionality
export function useRegister() {
  const { register, isLoading } = useAuth();
  return { register, isLoading };
}

// Hook for logout functionality
export function useLogout() {
  const { logout } = useAuth();
  return { logout };
}

// Hook for user management
export function useUser() {
  const { user, refreshUser, changePassword } = useAuth();
  return { user, refreshUser, changePassword };
}

// Hook for availability checks
export function useAvailabilityCheck() {
  const { checkEmailAvailability, checkUsernameAvailability } = useAuth();
  return { checkEmailAvailability, checkUsernameAvailability };
}

// Export types for convenience
export type { AuthContextType } from '@/contexts/AuthContext';