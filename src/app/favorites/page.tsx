"use client";

import { PageShell } from '@/components/PageShell';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AnimatedBookCard } from '@/components/AnimatedBookCard';
import { BookActions } from '@/components/BookActions';
import { useBooks } from '@/contexts/BooksContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

export default function FavoritesPage() {
  const { t, locale, dir } = useTranslation();
  const { books } = useBooks();
  const { favorites } = useFavorites();

  const favoriteBooks = useMemo(() => {
    return books.filter((book) => favorites.includes(book.id));
  }, [books, favorites]);

  return (
    <PageShell>
      <ProtectedRoute redirectTo="/favorites">
        <div className="mx-auto max-w-7xl space-y-12 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10 dark:border-slate-800">
            <div className="space-y-4">
              <h1 className="text-5xl font-black text-slate-900 dark:text-white leading-tight">
                {locale === 'ar' ? 'كتبي المفضلة' : 'My Favorites'}
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                {favoriteBooks.length} {locale === 'ar' ? 'كتاب محفوظ' : 'SAVED BOOKS'}
              </p>
            </div>
            
            {favoriteBooks.length > 0 && (
              <Link
                href="/books"
                className="flex items-center gap-3 text-brand font-black hover:underline underline-offset-4"
              >
                {locale === 'ar' ? 'تصفح المزيد' : 'Browse More'}
                <ArrowRight className={`size-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </Link>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {favoriteBooks.length > 0 ? (
              <motion.div 
                layout
                className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
              >
                {favoriteBooks.map((book) => (
                  <AnimatedBookCard 
                    key={book.id} 
                    book={book} 
                    extra={<BookActions bookId={book.id} />} 
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center space-y-6"
              >
                <div className="size-24 rounded-full bg-slate-50 flex items-center justify-center dark:bg-slate-800">
                  <Heart className="size-12 text-slate-200" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {locale === 'ar' ? 'لا يوجد كتب مفضلة بعد' : 'No favorites yet'}
                  </h2>
                  <p className="text-slate-500 max-w-md font-bold leading-relaxed">
                    {locale === 'ar' 
                      ? 'لم تقم بإضافة أي كتاب لمفضلتك حتى الآن. ابحث عن الكتب التي تعجبك واضغط على أيقونة القلب لحفظها.' 
                      : 'You haven\'t added any books to your favorites yet. Browse books and click the heart icon to save them.'}
                  </p>
                </div>
                <Link
                  href="/books"
                  className="rounded-full bg-brand px-10 py-4 text-lg font-black text-white shadow-glow transition-all hover:scale-105 active:scale-95"
                >
                  {locale === 'ar' ? 'ابدأ الاستكشاف' : 'Start Exploring'}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ProtectedRoute>
    </PageShell>
  );
}
