'use client';

import { useContext, useEffect, useState } from 'react';
import { AuthContext, type AuthContextType } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for protected routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      router.push('/auth/sign-in');
    }
  }, [isAuthenticated, isLoading, router, isMounted]);

  return { isAuthenticated, isLoading };
}

// Hook for guest routes (redirect if already authenticated)
export function useGuestOnly() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading && isAuthenticated) {
      console.log('useGuestOnly: Redirecting authenticated user to admin');
      router.replace('/admin/default');
    }
  }, [isAuthenticated, isLoading, router, isMounted]);

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
  const { logout, isLoading } = useAuth();
  return { logout, isLoading };
}

// Hook for user management
export function useUser() {
  const { user, refreshUser, isLoading } = useAuth();
  return { user, refreshUser, isLoading };
}

// Hook for availability checks
export function useAvailabilityCheck() {
  const { checkEmailAvailability, checkUsernameAvailability } = useAuth();
  return { checkEmailAvailability, checkUsernameAvailability };
}

// Export types for convenience
export type { AuthContextType } from '@/contexts/AuthContext';