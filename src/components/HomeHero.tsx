"use client";

import { useTranslation } from '@/contexts/LanguageContext';
import { useBooks } from '@/contexts/BooksContext';
import { useRouteStops } from '@/contexts/RouteContext';
import { useAuth } from '@/contexts/AuthContext';
import { useBorrow } from '@/contexts/BorrowContext';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

// عداد متحرك بسيط وآمن
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && value !== undefined) {
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

  if (value === undefined) return <span>0</span>;
  return <span ref={ref}>{count}</span>;
}

export function HomeHero() {
  const { t, locale, dir } = useTranslation();
  const { books } = useBooks();
  const { stops } = useRouteStops();
  const { totalUsers } = useAuth();
  const { activeBorrowingsCount } = useBorrow();

  const stats = [
    { label: t('hero.statBooks'), value: books.length, suffix: '+', color: 'from-amber-500/20 to-brand/20' },
    { label: t('hero.statStations'), value: stops.length, suffix: '', color: 'from-sky-500/20 to-blue-500/20' },
    { label: t('hero.statReaders'), value: totalUsers, suffix: '+', color: 'from-emerald-500/20 to-teal-500/20' },
    { label: t('hero.statBorrowings'), value: activeBorrowingsCount, suffix: '', color: 'from-rose-500/20 to-orange-500/20' },
  ];

  // تأكد من أن القيم أرقام صحيحة
  const safeStats = stats.map(s => ({ ...s, value: typeof s.value === 'number' ? s.value : 0 }));

  return (
    <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-white/80 to-brand/5 p-6 shadow-glow backdrop-blur dark:from-slate-950/80 dark:to-brand/10 md:p-10 lg:p-16">
      {/* زخارف خلفية متحركة */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-brand/5 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', delay: 2 }}
        className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* تخطيط مرن باستخدام flex (بديل عن grid لتجنب مشاكل RTL) */}
        <div className="flex flex-col-reverse gap-12 lg:flex-row lg:items-center">
          {/* العمود الأيسر: النصوص والأزرار */}
          <motion.div
            initial={{ opacity: 0, x: dir === 'rtl' ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={`flex-1 space-y-6 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-center lg:text-left`}
          >
            <h1 className="hero-gradient-text gradient-text text-4xl font-black leading-tight md:text-5xl lg:text-6xl xl:text-7xl">
              {locale === 'ar' ? t('brandSlogan') : t('brandSloganAlt')}
            </h1>
            <p className="text-base text-slate-700 dark:text-slate-300 md:text-lg">
              {t('hero.subtitle')}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t('hero.extraDescription')}
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4 lg:justify-start">
              <Link
                href="/buy"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-brand to-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 md:px-6 md:py-3"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>{t('hero.ctaBuy')}</span>
                </span>
              </Link>
              <Link
                href="/books"
                className="rounded-full border border-brand/30 bg-white/80 px-5 py-2.5 text-sm font-bold text-brand shadow-md backdrop-blur transition-all hover:scale-105 dark:bg-slate-900/80 dark:text-brand-light md:px-6 md:py-3"
              >
                {t('hero.ctaBooks')}
              </Link>
              <Link
                href="/route"
                className="rounded-full border border-brand/30 bg-white/80 px-5 py-2.5 text-sm font-bold text-brand shadow-md backdrop-blur transition-all hover:scale-105 dark:bg-slate-900/80 dark:text-brand-light md:px-6 md:py-3"
              >
                {t('hero.ctaRoute')}
              </Link>
            </div>
          </motion.div>

          {/* العمود الأيمن: صورة المكتبة */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -5 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
            className="flex-1"
          >
            <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/50 dark:ring-slate-800/50 md:h-80 md:w-80 lg:h-96 lg:w-96">
              <Image
                src="/images/herolibrary.png"
                alt={locale === 'ar' ? 'المكتبة المتنقلة' : 'Mobile Library'}
                fill
                sizes="(max-width: 768px) 80vw, 40vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* إحصائيات ملونة مع عداد متحرك */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {safeStats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-1 backdrop-blur-sm transition-all`}
            >
              <div className="h-full rounded-2xl bg-white/60 p-4 text-center dark:bg-slate-900/60">
                <p className="text-2xl font-black text-slate-900 dark:text-white md:text-3xl">
                  <AnimatedCounter value={stat.value} />
                  {stat.suffix}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}