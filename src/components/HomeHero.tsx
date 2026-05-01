"use client";

import { useTranslation } from '@/contexts/LanguageContext';
import { useBooks } from '@/contexts/BooksContext';
import { useRouteStops } from '@/contexts/RouteContext';
import { useAuth } from '@/contexts/AuthContext';
import { useBorrow } from '@/contexts/BorrowContext';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { BookOpen, MapPin, Users, Award, ArrowRight, ShoppingCart, Map } from 'lucide-react';

// عداد متحرك
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
  const { t, locale, dir } = useTranslation(); // نستدعي dir للتحكم في الاتجاه
  const { books } = useBooks();
  const { stops } = useRouteStops();
  const { totalUsers } = useAuth();
  const { activeBorrowingsCount } = useBorrow();

  const stats = [
    { icon: BookOpen, value: books.length, label: t('hero.statBooks'), suffix: '+', color: 'from-amber-500/20 to-brand/20' },
    { icon: MapPin, value: stops.length, label: t('hero.statStations'), suffix: '', color: 'from-sky-500/20 to-blue-500/20' },
    { icon: Users, value: totalUsers, label: t('hero.statReaders'), suffix: '+', color: 'from-emerald-500/20 to-teal-500/20' },
    { icon: Award, value: activeBorrowingsCount, label: t('hero.statBorrowings'), suffix: '', color: 'from-rose-500/20 to-orange-500/20' },
  ];

  return (
    <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-white/80 to-brand/5 p-6 shadow-glow backdrop-blur dark:from-slate-950/80 dark:to-brand/10 md:p-10 lg:p-16">
      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* تخطيط مرن: نص + صورة مع دعم RTL */}
        <div className={`grid gap-12 lg:grid-cols-2 items-center ${dir === 'rtl' ? 'lg:grid-flow-dense' : ''}`}>
          {/* العمود الأيسر (أو الأيمن حسب الاتجاه) */}
          <div className={`space-y-8 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-center lg:text-left`}>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="hero-gradient-text gradient-text text-5xl font-black leading-tight md:text-6xl lg:text-7xl"
              style={{ direction: dir === 'rtl' ? 'rtl' : 'ltr' }}
            >
              {locale === 'ar' ? t('brandSlogan') : t('brandSloganAlt')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg text-slate-700 dark:text-slate-300"
              style={{ direction: dir === 'rtl' ? 'rtl' : 'ltr' }}
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-sm text-slate-600 dark:text-slate-400"
              style={{ direction: dir === 'rtl' ? 'rtl' : 'ltr' }}
            >
              {t('hero.extraDescription')}
            </motion.p>

            {/* الأزرار - عرض أفقي مع مسافات وتوسيط على الشاشات الصغيرة */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <Link
                href="/buy"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-brand to-amber-600 px-6 py-3 text-sm font-black text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <ShoppingCart className="size-5" />
                  {t('hero.ctaBuy')}
                  <ArrowRight className={`size-4 transition-transform group-hover:translate-x-1 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </span>
              </Link>

              <Link
                href="/books"
                className="group relative overflow-hidden rounded-full border border-brand/30 bg-white/80 px-6 py-3 text-sm font-black text-brand shadow-md backdrop-blur transition-all hover:scale-105 hover:bg-white dark:bg-slate-900/80 dark:text-brand-light dark:hover:bg-slate-900"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <BookOpen className="size-5" />
                  {t('hero.ctaBooks')}
                  <ArrowRight className={`size-4 transition-transform group-hover:translate-x-1 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </span>
              </Link>

              <Link
                href="/route"
                className="group relative overflow-hidden rounded-full border border-brand/30 bg-white/80 px-6 py-3 text-sm font-black text-brand shadow-md backdrop-blur transition-all hover:scale-105 hover:bg-white dark:bg-slate-900/80 dark:text-brand-light dark:hover:bg-slate-900"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Map className="size-5" />
                  {t('hero.ctaRoute')}
                  <ArrowRight className={`size-4 transition-transform group-hover:translate-x-1 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </span>
              </Link>
            </motion.div>
          </div>

          {/* العمود الأيمن: صورة المكتبة - تظهر في الجهة المقابلة حسب RTL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
            className={`relative mx-auto w-full max-w-md lg:max-w-full ${
              dir === 'rtl' ? 'lg:col-start-1' : ''
            }`}
          >
            <div className="relative aspect-square overflow-hidden rounded-[2rem] shadow-2xl ring-4 ring-white/50 dark:ring-slate-800/50">
              <Image
                src="/images/herolibrary.png"
                alt={locale === 'ar' ? 'المكتبة المتنقلة' : 'Mobile Library'}
                fill
                sizes="(max-width: 768px) 80vw, 40vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* الإحصائيات - تظل مركزة وتتكيف مع الاتجاه */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-20 grid grid-cols-2 gap-5 md:grid-cols-4"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-1 backdrop-blur-sm transition-all`}
            >
              <div className="h-full rounded-2xl bg-white/60 p-5 text-center dark:bg-slate-900/60">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-brand to-amber-500 text-white shadow-md">
                  <stat.icon className="size-6" />
                </div>
                <p className="text-3xl font-black text-slate-900 dark:text-white">
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