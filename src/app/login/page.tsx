"use client";

import { PageShell } from '@/components/PageShell';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/AnimatedComponents';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = login(email, password);
    if (!result.success) {
      setError(result.message || 'Error');
      return;
    }

    if (result.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push(redirect);
    }
  };

  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-xl"
      >
        <form
          onSubmit={onSubmit}
          className="space-y-6 rounded-[2rem] border border-brand/10 bg-white p-8 shadow-glow dark:bg-slate-900"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 mb-6"
          >
            <motion.div
              whileHover={{ rotate: 10 }}
              className="p-3 bg-brand/10 rounded-2xl text-brand"
            >
              <LogIn className="size-6" />
            </motion.div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              {t('auth.loginTitle')}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder={t('auth.email')}
              required
              autoComplete="email"
              className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2 dark:text-white transition-all focus:border-brand"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder={t('auth.password')}
              required
              autoComplete="current-password"
              className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2 dark:text-white transition-all focus:border-brand"
            />
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-rose-600 font-bold"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full rounded-full bg-brand px-4 py-3 font-semibold text-white shadow-glow hover:shadow-lg transition-all"
          >
            {t('auth.submitLogin')}
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-center text-sm text-slate-500 dark:text-slate-400"
          >
            {t('auth.noAccount')}{' '}
            <Link
              href={`/register${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
              className="text-brand font-bold underline underline-offset-2 hover:text-brand-dark transition-colors"
            >
              {t('auth.registerTitle')}
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </PageShell>
  );
}
