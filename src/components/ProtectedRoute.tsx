"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-[2rem] border border-brand/10 bg-white p-8 text-center shadow-glow dark:bg-slate-900"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          className="flex justify-center mb-4"
        >
          <div className="p-4 bg-brand/10 rounded-2xl text-brand">
            <Lock className="size-6" />
          </div>
        </motion.div>
        <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          {t('auth.required')}
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
            className="inline-block rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-glow hover:shadow-lg transition-all"
          >
            {t('nav.login')}
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return <>{children}</>;
}
