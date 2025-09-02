'use client';

import { useAuth } from '@/hooks/useAuth';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function Home({}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/admin/default');
      } else {
        router.replace('/auth/sign-in');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return null;
}
