"use client";

import { AnimatedBookCard } from '@/components/AnimatedBookCard';
import { BookActions } from '@/components/BookActions';
import { PageShell } from '@/components/PageShell';
import { CurrencySelector } from '@/components/CurrencySelector';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useBooks } from '@/contexts/BooksContext';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { matchesCategory } from '@/utils/categoryUtils'; // ✅ استيراد الدالة المساعدة
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

  // الحصول على كائن التصنيف المحدد (إذا لم يكن 'all')
  const selectedCategory = useMemo(() => {
    if (activeCategory === 'all') return null;
    return categories.find(cat => cat.id === activeCategory);
  }, [activeCategory, categories]);

  const filteredBooks = useMemo(() => {
    if (!selectedCategory) return books;
    // فلترة الكتب: تحقق مما إذا كان التصنيف المحدد ضمن تصنيفات الكتاب (أو يساويه)
    return books.filter(book => {
      const arMatch = matchesCategory(book.category_ar, selectedCategory.name_ar);
      const enMatch = matchesCategory(book.category_en, selectedCategory.name_en);
      return arMatch || enMatch;
    });
  }, [books, selectedCategory]);

  return (
    <PageShell>
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-transparent gradient-text md:text-5xl">{t('buy.title')}</h1>
            <p className="text-slate-600 dark:text-slate-300">{t('misc.searchFree')}</p>
          </div>
          <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-[2rem] border border-brand/10 backdrop-blur">
            <CurrencySelector compact />
          </div>
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
                  extra={<BookActions bookId={book.id} />}
                />
              </ScrollReveal>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </PageShell>
  );
}