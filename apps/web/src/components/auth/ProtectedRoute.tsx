'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRoles?: string[]; // Thêm role-based access
  fallbackPath?: string; // Custom redirect path
  showLoading?: boolean; // Có hiển thị loading không
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true,
  requiredRoles = [],
  fallbackPath,
  showLoading = true
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Kiểm tra role-based access
      if (requiredRoles.length > 0 && user) {
        const hasRequiredRole = requiredRoles.some(role => 
          user.roles?.includes(role)
        );
        
        if (!hasRequiredRole) {
          // Không có quyền truy cập
          const redirectPath = fallbackPath || '/admin/default';
          router.replace(redirectPath);
          return;
        }
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRoles, fallbackPath, router]);

  // Kiểm tra quyền truy cập role-based
  if (isAuthenticated && requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some(role => 
      user.roles?.includes(role)
    );
    
    if (!hasRequiredRole) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Không có quyền truy cập
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Bạn không có quyền truy cập vào trang này.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}