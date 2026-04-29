"use client";

import { AnimatedBookCard } from '@/components/AnimatedBookCard';
import { PageShell } from '@/components/PageShell';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useBooks } from '@/contexts/BooksContext';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';

export default function BuyPage() {
  const { books, categories } = useBooks();
  const { addToCart } = useCart();
  const { locale, t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [doneId, setDoneId] = useState<string | null>(null);
  const filterLabels = useMemo(
    () => [
      { id: 'all', label: t('filters.all') },
      ...categories.map((category) => ({
        id: category.id,
        label: locale === 'ar' ? category.name_ar : category.name_en
      }))
    ],
    [categories, locale, t]
  );
  const filteredBooks =
    activeCategory === 'all'
      ? books
      : books.filter((book) =>
          categories.some(
            (category) =>
              category.id === activeCategory &&
              (book.category_ar === category.name_ar || book.category_en === category.name_en)
          )
        );

  return (
    <PageShell>
      <section className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-transparent gradient-text md:text-5xl">{t('buy.title')}</h1>
          <p className="text-slate-600 dark:text-slate-300">{t('misc.searchFree')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {filterLabels.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition-all ${
                activeCategory === category.id
                  ? 'bg-brand text-white shadow-glow'
                  : 'bg-white/70 text-brand backdrop-blur dark:bg-slate-900/70 dark:text-brand-light'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {filteredBooks.map((book) => (
              <ScrollReveal key={book.id}>
                <AnimatedBookCard
                  book={book}
                  actionLabel={t('book.add')}
                  actionState={doneId === book.id ? 'done' : 'idle'}
                  onAction={() => {
                    addToCart(book.id);
                    setDoneId(book.id);
                    window.setTimeout(() => setDoneId((current) => (current === book.id ? null : current)), 1200);
                  }}
                />
              </ScrollReveal>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </PageShell>
  );
}
