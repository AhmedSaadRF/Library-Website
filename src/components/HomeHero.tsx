"use client";

import { useTranslation } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function HomeHero() {
  const { t, locale } = useTranslation();

  return (
    <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-white/80 to-brand/5 p-8 shadow-glow backdrop-blur dark:from-slate-950/80 dark:to-brand/10 md:p-16">
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Hero Title – النص الرئيسي */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-gradient-text gradient-text text-5xl font-black leading-tight md:text-7xl lg:text-8xl"
        >
          {locale === 'ar' ? 'في كل محطة حكاية' : 'Every Station Has a Story'}
        </motion.h1>

        {/* Hero Subtitle – نص عادي (لا يحتاج إصلاحاً خاصاً) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-700 dark:text-slate-300 md:text-xl"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/buy"
            className="rounded-full bg-brand px-8 py-4 text-sm font-black text-white shadow-glow transition-all hover:scale-105 hover:shadow-xl"
          >
            {t('hero.ctaBuy')}
          </Link>
          <Link
            href="/books"
            className="rounded-full bg-white/80 px-8 py-4 text-sm font-black text-brand shadow-md backdrop-blur transition-all hover:scale-105 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900"
          >
            {t('hero.ctaBooks')}
          </Link>
          <Link
            href="/route"
            className="rounded-full bg-white/80 px-8 py-4 text-sm font-black text-brand shadow-md backdrop-blur transition-all hover:scale-105 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900"
          >
            {t('hero.ctaRoute')}
          </Link>
        </motion.div>
      </div>

      {/* عناصر زخرفية اختيارية */}
      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />
    </section>
  );
}