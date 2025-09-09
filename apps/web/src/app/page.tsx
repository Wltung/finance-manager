'use client';

import { useAuth } from '@/hooks/useAuth';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function Home({}) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
    </div>
  );
}
