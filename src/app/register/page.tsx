"use client";

import { PageShell } from '@/components/PageShell';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = register(name, email, password);
    if (!result.success) {
      setError(result.message || 'Error');
      return;
    }
    router.push(redirect);
  };

  return (
    <PageShell>
      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-xl space-y-4 rounded-[2rem] border border-brand/10 bg-white p-8 shadow-glow dark:bg-slate-900"
      >
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          {t('auth.registerTitle')}
        </h1>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('auth.name')}
          required
          autoComplete="name"
          className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2 dark:text-white"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder={t('auth.email')}
          required
          autoComplete="email"
          className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2 dark:text-white"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder={t('auth.password')}
          required
          autoComplete="new-password"
          className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2 dark:text-white"
        />

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-brand px-4 py-3 font-semibold text-white"
        >
          {t('auth.submitRegister')}
        </button>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          <Link
            href={`/login${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="text-brand underline underline-offset-2"
          >
            {t('auth.loginTitle')}
          </Link>
        </p>
      </form>
    </PageShell>
  );
}
