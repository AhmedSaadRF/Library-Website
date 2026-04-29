"use client";

import { AnimatedBookCard } from '@/components/AnimatedBookCard';
import { PageShell } from '@/components/PageShell';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useBooks } from '@/contexts/BooksContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

export default function BooksPage() {
  const { books, categories } = useBooks();
  const { locale, t } = useTranslation();
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
  const [activeCategory, setActiveCategory] = useState('all');

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
      <section className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-transparent gradient-text md:text-5xl">{t('books.title')}</h1>
          <p className="text-slate-600 dark:text-slate-300">{t('books.subtitle')}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {filterLabels.map((category) => (
            <motion.button
              key={category.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full px-5 py-3 font-semibold ${
                activeCategory === category.id
                  ? 'bg-brand text-white shadow-glow'
                  : 'bg-white/70 text-brand backdrop-blur dark:bg-slate-900/70 dark:text-brand-light'
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </div>

        <motion.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
          <AnimatePresence>
            {filteredBooks.map((book) => (
              <ScrollReveal key={book.id}>
                <AnimatedBookCard book={book} />
              </ScrollReveal>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredBooks.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-300">{t('misc.noBooks')}</p>
        ) : null}
      </section>
    </PageShell>
  );
}
