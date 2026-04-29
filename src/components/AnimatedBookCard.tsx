"use client";

import { useTranslation } from '@/contexts/LanguageContext';
import { Book } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Headphones } from 'lucide-react';
import { ReactNode } from 'react';

export function AnimatedBookCard({
  book,
  actionLabel,
  onAction,
  actionState,
  extra
}: {
  book: Book;
  actionLabel?: string;
  onAction?: () => void;
  actionState?: 'idle' | 'done';
  extra?: ReactNode;
}) {
  const { locale, t } = useTranslation();
  const title = locale === 'ar' ? book.title_ar : book.title_en;
  const author = locale === 'ar' ? book.author_ar : book.author_en;
  const category = locale === 'ar' ? book.category_ar : book.category_en;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 26, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.92 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="group relative overflow-hidden rounded-[2rem] border border-white/30 bg-white/70 shadow-glow backdrop-blur dark:bg-slate-900/60"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(135deg, rgba(139,90,43,0.14), rgba(212,176,123,0.08), rgba(154,163,65,0.12))',
          backgroundSize: '200% 200%'
        }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <Link href={`/books/${book.id}`}>
        <div className="relative h-72 overflow-hidden">
          <Image src={book.coverUrl} alt={title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>
        <div className="relative space-y-4 p-5 pb-0">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand/70">{category}</p>
            <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors">{title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{author}</p>
          </div>
        </div>
      </Link>
      <div className="relative space-y-4 p-5 pt-2">
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-2">
            {book.type === 'audio' ? <Headphones className="size-4" /> : null}
            {book.type === 'audio' ? t('book.audioType') : t('book.regularType')}
          </span>
          <span className="font-bold text-brand dark:text-brand-light">${book.price}</span>
        </div>
        {extra}
        {onAction && actionLabel ? (
          <motion.button
            type="button"
            whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(139,90,43,0.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onAction}
            className="w-full rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={actionState}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="inline-flex items-center gap-2"
              >
                {actionState === 'done' ? <CheckCircle2 className="size-4" /> : null}
                {actionState === 'done' ? t('book.done') : actionLabel}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        ) : null}
      </div>
    </motion.article>
  );
}
