"use client";

import { AudioPlayer } from '@/components/AudioPlayer';
import { PageShell } from '@/components/PageShell';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useBooks } from '@/contexts/BooksContext';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { Order } from '@/types';
import { readStorage, writeStorage } from '@/utils/localStorageUtils';
import { v4 as uuid } from 'uuid';
import { useMemo, useState } from 'react';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { books } = useBooks();
  const { items, clearCart } = useCart();
  const { locale, t } = useTranslation();
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState('Alexandria, Egypt');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const detailedItems = useMemo(
    () =>
      items
        .map((item) => ({ ...item, book: books.find((book) => book.id === item.bookId) }))
        .filter((item) => item.book),
    [books, items]
  );
  const total = detailedItems.reduce((sum, item) => sum + (item.book?.price || 0) * item.quantity, 0);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const order: Order = {
      id: uuid(),
      userEmail: user.email,
      items: items.map((item) => ({ bookId: item.bookId, quantity: item.quantity })),
      total,
      createdAt: new Date().toISOString(),
      customerName: name,
      address
    };

    const existing = readStorage<Order[]>('mobile-library-orders', []);
    writeStorage('mobile-library-orders', [order, ...existing]);
    setConfirmedOrder(order);
    clearCart();
  };

  return (
    <PageShell>
      <ProtectedRoute redirectTo="/checkout">
        <section className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white">{t('checkout.title')}</h1>
            <p className="text-slate-600 dark:text-slate-300">
              {confirmedOrder ? t('checkout.success') : t('misc.searchFree')}
            </p>
          </div>

          {!confirmedOrder ? (
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[2rem] border border-brand/10 bg-white p-6 shadow-glow dark:bg-slate-900">
                <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">{t('cart.title')}</h2>
                <div className="space-y-3">
                  {detailedItems.map((item) => (
                    <div key={item.bookId} className="rounded-2xl bg-brand/5 p-4 dark:bg-white/5">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {locale === 'ar' ? item.book?.title_ar : item.book?.title_en}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-300">x{item.quantity}</p>
                    </div>
                  ))}
                  <p className="text-lg font-bold text-brand dark:text-brand-light">
                    {t('cart.total')}: ${total.toFixed(2)}
                  </p>
                </div>
              </div>

              <form onSubmit={submit} className="space-y-4 rounded-[2rem] border border-brand/10 bg-white p-6 shadow-glow dark:bg-slate-900">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('checkout.name')}
                  className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
                />
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t('checkout.address')}
                  className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
                />
                <select className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2" defaultValue="cash">
                  <option value="cash">{t('checkout.simulation')} - Cash</option>
                  <option value="card">{t('checkout.simulation')} - Card</option>
                </select>
                <button type="submit" className="w-full rounded-full bg-brand px-4 py-3 font-semibold text-white">
                  {t('checkout.placeOrder')}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6 rounded-[2rem] border border-brand/10 bg-white p-6 shadow-glow dark:bg-slate-900">
              {confirmedOrder.items.map((item) => {
                const book = books.find((entry) => entry.id === item.bookId);
                if (!book) return null;
                const title = locale === 'ar' ? book.title_ar : book.title_en;
                const content = locale === 'ar' ? book.content_ar : book.content_en;

                return (
                  <div key={item.bookId} className="space-y-3 rounded-3xl bg-brand/5 p-5 dark:bg-white/5">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
                    {book.type === 'audio' && book.audioSrc ? <AudioPlayer src={book.audioSrc} /> : null}
                    {book.type === 'regular' && content ? (
                      <p className="leading-8 text-slate-700 dark:text-slate-200">{content}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </ProtectedRoute>
    </PageShell>
  );
}
