'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true = cần đăng nhập, false = chỉ guest
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // Cần đăng nhập nhưng chưa đăng nhập
        router.replace('/auth/sign-in');
      } else if (!requireAuth && isAuthenticated) {
        // Chỉ dành cho guest nhưng đã đăng nhập
        router.replace('/admin/default');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, router]);

  // Không hiển thị gì nếu đang redirect
  if (requireAuth && !isAuthenticated) return null;
  if (!requireAuth && isAuthenticated) return null;

  return <>{children}</>;
}