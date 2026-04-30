"use client";

import { AdminBookManager } from '@/components/AdminBookManager';
import { AdminCategoryManager } from '@/components/AdminCategoryManager';
import { AdminRouteManager } from '@/components/AdminRouteManager';
import { AdminUserManager } from '@/components/AdminUserManager';
import { AdminBorrowingManager } from '@/components/AdminBorrowingManager';
import { PageShell } from '@/components/PageShell';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Tab = 'books' | 'route' | 'categories' | 'users' | 'borrowings';

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('books');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Basic protection logic
    if (user !== undefined) { // Assuming AuthContext might have a loading state, but here user is null or object
       if (!user || !isAdmin) {
         router.push('/login?redirect=/admin/dashboard');
       } else {
         setIsReady(true);
       }
    }
  }, [user, isAdmin, router]);

  if (!isReady) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'books', label: t('admin.books') },
    { key: 'categories', label: t('admin.categories') },
    { key: 'route', label: t('admin.route') },
    { key: 'users', label: t('admin.users') },
    { key: 'borrowings', label: t('borrow.myBorrowings') }
  ];

  return (
    <PageShell>
      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          {tabs.map(({ key, label }) => (
            <motion.button
              key={key}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-full px-5 py-3 font-semibold transition-colors ${
                tab === key
                  ? 'bg-brand text-white shadow-glow'
                  : 'bg-white text-brand dark:bg-slate-900 dark:text-brand-light shadow-sm'
              }`}
            >
              {label}
            </motion.button>
          ))}

          <button
            type="button"
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="ms-auto rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
          >
            {t('nav.logout')}
          </button>
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'books' && <AdminBookManager />}
          {tab === 'categories' && <AdminCategoryManager />}
          {tab === 'route' && <AdminRouteManager />}
          {tab === 'users' && <AdminUserManager />}
          {tab === 'borrowings' && <AdminBorrowingManager />}
        </motion.div>
      </section>
    </PageShell>
  );
}
