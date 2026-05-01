"use client";

import { useTranslation } from '@/contexts/LanguageContext';
import { useBooks } from '@/contexts/BooksContext';
import { useRouteStops } from '@/contexts/RouteContext';
import { useAuth } from '@/contexts/AuthContext';
import { useBorrow } from '@/contexts/BorrowContext';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { BookOpen, MapPin, Users, Award } from 'lucide-react';

// مكون عداد متحرك بسيط
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = value / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
}

export function HomeHero() {
  const { t, locale } = useTranslation();
  const { books } = useBooks(); // عدد الكتب
  const { stops } = useRouteStops(); // عدد المحطات
  const { totalUsers } = useAuth(); // عدد المستخدمين
  const { activeBorrowingsCount } = useBorrow(); // عدد الاستعارات النشطة

  const stats = [
    { icon: BookOpen, value: books.length, label: t('hero.statBooks'), suffix: '+' },
    { icon: MapPin, value: stops.length, label: t('hero.statStations'), suffix: '' },
    { icon: Users, value: totalUsers, label: t('hero.statReaders'), suffix: '+' },
    { icon: Award, value: activeBorrowingsCount, label: t('hero.statBorrowings'), suffix: '' },
  ];

  return (
    <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-white/80 to-brand/5 p-6 shadow-glow backdrop-blur dark:from-slate-950/80 dark:to-brand/10 md:p-10 lg:p-16">
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-gradient-text gradient-text text-5xl font-black leading-tight md:text-7xl lg:text-8xl"
          >
            {locale === 'ar' ? t('brandSlogan') : t('brandSloganAlt')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto mt-6 max-w-3xl text-base text-slate-700 dark:text-slate-300 md:text-xl"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-400 md:text-base"
          >
            {t('hero.extraDescription')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
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

        {/* إحصائيات ديناميكية */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 grid grid-cols-2 gap-6 border-t border-white/30 pt-12 md:grid-cols-4"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/20 text-brand">
                <stat.icon className="size-6" />
              </div>
              <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                <AnimatedCounter value={stat.value} />
                {stat.suffix}
              </p>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />
    </section>
  );
}