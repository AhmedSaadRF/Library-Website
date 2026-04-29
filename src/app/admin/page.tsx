"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminRootPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user !== undefined) {
      if (user && isAdmin) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/login?redirect=/admin/dashboard');
      }
    }
  }, [user, isAdmin, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
    </div>
  );
}
