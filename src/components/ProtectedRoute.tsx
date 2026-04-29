"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  /** Path to return to after login (defaults to /checkout) */
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = '/checkout' }: ProtectedRouteProps) {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) {
    return (
      <div className="rounded-[2rem] border border-brand/10 bg-white p-8 text-center shadow-glow dark:bg-slate-900">
        <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          {t('auth.required')}
        </p>
        <Link
          href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
          className="rounded-full bg-brand px-5 py-3 font-semibold text-white"
        >
          {t('nav.login')}
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
