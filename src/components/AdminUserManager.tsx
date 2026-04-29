"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { StoredUser } from '@/types';
import { readStorage, writeStorage } from '@/utils/localStorageUtils';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const PROTECTED_EMAIL = 'admin@mobilelibrary.com';

export function AdminUserManager() {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<StoredUser[]>(() =>
    readStorage<StoredUser[]>('mobile-library-users', [])
  );

  const deleteUser = (email: string) => {
    if (email === PROTECTED_EMAIL) return;
    const updated = users.filter((u) => u.email !== email);
    writeStorage('mobile-library-users', updated);
    setUsers(updated);
  };

  const toggleRole = (email: string) => {
    if (email === PROTECTED_EMAIL) return;
    const updated: StoredUser[] = users.map((u) => {
      if (u.email === email) {
        // Fix for TypeScript type inference issue during build
        const newRole: 'user' | 'admin' = u.role === 'admin' ? 'user' : 'admin';
        return { ...u, role: newRole };
      }
      return u;
    });
    writeStorage('mobile-library-users', updated);
    setUsers(updated);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {t('admin.usersHint')}
      </p>

      {users.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400">{t('admin.noUsers')}</p>
      )}

      <AnimatePresence>
        {users.map((u) => {
          const isProtected = u.email === PROTECTED_EMAIL;
          const isSelf = u.email === currentUser?.email;
          const regDate = u.registeredAt || '2025-01-01';

          return (
            <motion.div
              key={u.email}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-brand/10 bg-white p-5 dark:bg-slate-900"
            >
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {u.name || u.email}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{u.email}</p>
                <p className="text-xs text-slate-400">{regDate}</p>
                <div className="mt-2 flex gap-2">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                      u.role === 'admin'
                        ? 'bg-brand/15 text-brand dark:text-brand-light'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {u.role}
                  </span>
                  {isSelf && (
                    <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                      you
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isProtected || isSelf}
                  onClick={() => toggleRole(u.email)}
                  className="rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {u.role === 'admin' ? 'Demote' : 'Promote'}
                </button>
                <button
                  type="button"
                  disabled={isProtected || isSelf}
                  onClick={() => deleteUser(u.email)}
                  className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-rose-900/30 dark:text-rose-300"
                >
                  {t('admin.deleteUser')}
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
