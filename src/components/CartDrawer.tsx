"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useBooks } from '@/contexts/BooksContext';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

export function CartDrawer() {
  const { books } = useBooks();
  const { items, isOpen, closeCart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const { locale, dir, t } = useTranslation();

  const detailedItems = items
    .map((item) => ({ ...item, book: books.find((book) => book.id === item.bookId) }))
    .filter((item) => item.book);
  const total = detailedItems.reduce((sum, item) => sum + (item.book?.price || 0) * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-40 bg-slate-950/40"
            aria-label={t('cart.close')}
          />
          <motion.aside
            initial={{ x: dir === 'rtl' ? -420 : 420 }}
            animate={{ x: 0 }}
            exit={{ x: dir === 'rtl' ? -420 : 420 }}
            transition={{ type: 'spring', stiffness: 250, damping: 28 }}
            className={`fixed ${dir === 'rtl' ? 'left-0' : 'right-0'} top-0 z-50 flex h-full w-full max-w-md flex-col bg-white p-6 shadow-2xl dark:bg-slate-950`}
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('cart.title')}</h2>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-full bg-brand/10 p-2 text-brand"
                aria-label={t('cart.close')}
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto">
              {detailedItems.length === 0 ? (
                <p className="text-slate-600 dark:text-slate-300">{t('cart.empty')}</p>
              ) : null}

              <AnimatePresence>
                {detailedItems.map((item) => (
                  <motion.div
                    key={item.bookId}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    className="rounded-3xl border border-brand/10 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {locale === 'ar' ? item.book?.title_ar : item.book?.title_en}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-300">${item.book?.price}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.bookId)}
                        className="text-sm font-semibold text-rose-600"
                      >
                        {t('admin.delete')}
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                        className="rounded-full bg-brand/10 px-3 py-1 text-brand"
                      >
                        -
                      </motion.button>
                      <span aria-live="polite" className="font-bold">{item.quantity}</span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                        className="rounded-full bg-brand/10 px-3 py-1 text-brand"
                      >
                        +
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-6 space-y-3 border-t border-brand/10 pt-4">
              <div className="flex items-center justify-between text-lg font-bold text-slate-900 dark:text-white">
                <span>{t('cart.total')}</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Link
                href={user ? '/checkout' : '/login?redirect=/checkout'}
                onClick={closeCart}
                className="block rounded-full bg-brand px-4 py-3 text-center text-sm font-semibold text-white"
              >
                {t('cart.checkout')}
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
