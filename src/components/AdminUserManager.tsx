"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { StoredUser } from '@/types';
import { readStorage, writeStorage } from '@/utils/localStorageUtils';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Users, Trash2, Shield } from 'lucide-react';

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
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-900/20"
      >
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600">
          <Users className="size-6" />
        </div>
        <p className="text-sm text-blue-600 dark:text-blue-300 font-bold">
          {t('admin.usersHint')}
        </p>
      </motion.div>

      {users.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-slate-500 dark:text-slate-400 py-8"
        >
          {t('admin.noUsers')}
        </motion.p>
      )}

      <AnimatePresence mode="popLayout">
        {users.map((u, index) => {
          const isProtected = u.email === PROTECTED_EMAIL;
          const isSelf = u.email === currentUser?.email;
          const regDate = u.registeredAt || '2025-01-01';

          return (
            <motion.div
              key={u.email}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, x: -100 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-brand/10 bg-white p-6 dark:bg-slate-900 shadow-glow hover:shadow-lg transition-all"
            >
              <div className="flex-1">
                <motion.h3
                  whileHover={{ x: 4 }}
                  className="font-bold text-slate-900 dark:text-white"
                >
                  {u.name || u.email}
                </motion.h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{u.email}</p>
                <p className="text-xs text-slate-400">{regDate}</p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className={`inline-block rounded-full px-3 py-1 text-xs font-bold transition-all ${u.role === 'admin'
                        ? 'bg-brand/15 text-brand dark:text-brand-light'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                  >
                    {u.role === 'admin' && <Shield className="size-3 inline mr-1" />}
                    {u.role}
                  </motion.span>
                  {isSelf && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    >
                      ✓ You
                    </motion.span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  disabled={isProtected || isSelf}
                  onClick={() => toggleRole(u.email)}
                  className="rounded-full bg-brand/10 px-6 py-3 text-sm font-bold text-brand hover:bg-brand/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                >
                  {u.role === 'admin' ? 'Demote' : 'Promote'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  disabled={isProtected || isSelf}
                  onClick={() => deleteUser(u.email)}
                  className="rounded-full bg-rose-100 px-6 py-3 text-sm font-bold text-rose-700 hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50 transition-all"
                >
                  <Trash2 className="size-4 inline mr-2" />
                  Delete
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
