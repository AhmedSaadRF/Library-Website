"use client";

import { useTranslation } from '@/contexts/LanguageContext';
import { Book } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FavoriteButton } from './FavoriteButton';
import { ReactNode } from 'react';

interface BookCardProps {
  book: Book;
  onPrimaryAction?: () => void;
  actionLabel?: string;
  extra?: ReactNode;
}

// دالة قوية لتنسيق التصنيفات: تعمل مع string أو array، وتضيف " • " بينهم
function formatCategories(cat: string | string[], locale: 'ar' | 'en'): string {
  if (Array.isArray(cat)) {
    return cat.join(' • ');
  }
  if (typeof cat === 'string') {
    // لو كان النص يحتوي بالفعل على " • " أو مسافات، نرجعه كما هو
    // لكن في حال كان ملتصقاً بدون فواصل (مثلاً "أطفالتعليم مبكر") فهذا لن يحدث إلا إذا كانت البيانات خاطئة
    return cat;
  }
  return '';
}

export function BookCard({ book, onPrimaryAction, actionLabel, extra }: BookCardProps) {
  const { locale } = useTranslation();
  const title = locale === 'ar' ? book.title_ar : book.title_en;
  const author = locale === 'ar' ? book.author_ar : book.author_en;
  const categoriesRaw = locale === 'ar' ? book.category_ar : book.category_en;
  const categoriesDisplay = formatCategories(categoriesRaw, locale);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="overflow-hidden rounded-[2rem] border border-brand/10 bg-white shadow-glow dark:bg-slate-900"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={book.coverUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute right-4 top-4 z-10">
          <FavoriteButton bookId={book.id} className="bg-white/80 shadow-lg backdrop-blur-sm dark:bg-slate-900/80" />
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div>
          <p className="break-words text-xs font-bold uppercase tracking-[0.3em] text-brand/70">
            {categoriesDisplay}
          </p>
          <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{author}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
          <span>{book.type === 'audio' ? 'Audiobook' : 'Regular Book'}</span>
          <span className="font-bold text-brand dark:text-brand-light">${book.price}</span>
        </div>
        {extra}
        {onPrimaryAction && actionLabel ? (
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.01 }}
            type="button"
            onClick={onPrimaryAction}
            className="w-full rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white"
          >
            {actionLabel}
          </motion.button>
        ) : null}
      </div>
    </motion.article>
  );
}