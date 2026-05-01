"use client";

import { useTranslation } from '@/contexts/LanguageContext';
import { useBooks } from '@/contexts/BooksContext';
import { useRouteStops } from '@/contexts/RouteContext';
import { useAuth } from '@/contexts/AuthContext';
import { useBorrow } from '@/contexts/BorrowContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect, useMemo } from 'react';

// عداد متحرك محسّن مع دعم تقليل الحركة
function AnimatedCounter({
  value,
  duration = 2,
  delay = 0
}: {
  value: number;
  duration?: number;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView || value === undefined || value === 0) {
      setCount(value ?? 0);
      return;
    }

    if (shouldReduceMotion) {
      setCount(value);
      return;
    }

    let frameId: number;
    let startTime: number | null = null;
    let start = 0;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      const newCount = Math.floor(value * progress);
      setCount(newCount);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    const timeoutId = setTimeout(() => {
      frameId = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(frameId);
    };
  }, [isInView, value, duration, delay, shouldReduceMotion]);

  return (
    <span
      ref={ref}
      className="tabular-nums"
      role="status"
      aria-live="polite"
    >
      {count}
    </span>
  );
}

export function HomeHero() {
  const { t, locale, dir } = useTranslation();
  const { books } = useBooks();
  const { stops } = useRouteStops();
  const { totalUsers } = useAuth();
  const { activeBorrowingsCount } = useBorrow();
  const shouldReduceMotion = useReducedMotion();

  // إعدادات الـ animations
  const animationDuration = shouldReduceMotion ? 0.3 : 0.6;
  const animationDelay = shouldReduceMotion ? 0 : 0.2;

  const stats = useMemo(() => [
    {
      label: t('hero.statBooks'),
      value: Math.max(0, books.length ?? 0),
      suffix: '+',
      icon: '📚',
      color: 'from-amber-500/20 to-amber-600/20',
      lightColor: 'from-amber-400 to-amber-500'
    },
    {
      label: t('hero.statStations'),
      value: Math.max(0, stops.length ?? 0),
      suffix: '',
      icon: '🏠',
      color: 'from-sky-500/20 to-blue-500/20',
      lightColor: 'from-sky-400 to-blue-500'
    },
    {
      label: t('hero.statReaders'),
      value: Math.max(0, totalUsers ?? 0),
      suffix: '+',
      icon: '👥',
      color: 'from-emerald-500/20 to-teal-500/20',
      lightColor: 'from-emerald-400 to-teal-500'
    },
    {
      label: t('hero.statBorrowings'),
      value: Math.max(0, activeBorrowingsCount ?? 0),
      suffix: '',
      icon: '📖',
      color: 'from-rose-500/20 to-orange-500/20',
      lightColor: 'from-rose-400 to-orange-500'
    },
  ], [t, books.length, stops.length, totalUsers, activeBorrowingsCount]);

  // اتجاه النص والمحاذاة
  const isRTL = dir === 'rtl';

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/80 via-white/40 to-brand/5 p-6 shadow-lg backdrop-blur-md dark:from-slate-950/80 dark:via-slate-900/40 dark:to-brand/10 md:p-10 lg:p-16">
      {/* الخلفية المتحركة - الكرات الضبابية */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: shouldReduceMotion ? 0.3 : 0.4, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 8, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-gradient-to-br from-brand/20 to-brand/5 blur-3xl"
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: shouldReduceMotion ? 0.3 : 0.4, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 10, repeat: Infinity, repeatType: 'reverse', delay: 2 }}
        className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/5 blur-3xl"
        aria-hidden="true"
      />

      {/* الشرارات الزخرفية الإضافية */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', delay: 4 }}
            className="absolute top-1/3 right-1/4 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-500/5 to-teal-500/5 blur-2xl"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', delay: 6 }}
            className="absolute bottom-1/4 left-1/3 h-60 w-60 rounded-full bg-gradient-to-br from-purple-500/5 to-pink-500/5 blur-3xl"
            aria-hidden="true"
          />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* القسم العلوي - النص والصورة */}
        <div className="flex flex-col-reverse gap-12 lg:gap-16 lg:flex-row lg:items-center">

          {/* العمود الأيسر: العنوان والنص والأزرار */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 40 : -40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: animationDuration, delay: 0.1 }}
            className={`flex-1 space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}
          >
            {/* العنوان الرئيسي مع تأثير gradient */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: animationDuration, delay: 0.2 }}
            >
              <h1 className="relative inline-block text-4xl font-black leading-tight md:text-5xl lg:text-6xl xl:text-7xl">
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-brand via-amber-600 to-orange-600 bg-clip-text text-transparent blur-sm opacity-75"
                  animate={shouldReduceMotion ? {} : { opacity: [0.75, 1, 0.75] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  aria-hidden="true"
                >
                  {locale === 'ar' ? t('brandSlogan') : t('brandSloganAlt')}
                </motion.span>
                <span className="relative bg-gradient-to-r from-brand via-amber-600 to-orange-600 bg-clip-text text-transparent">
                  {locale === 'ar' ? t('brandSlogan') : t('brandSloganAlt')}
                </span>
              </h1>
            </motion.div>

            {/* النص الثانوي */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: animationDuration, delay: 0.3 }}
              className="space-y-3"
            >
              <p className="max-w-xl text-base text-slate-700 dark:text-slate-300 md:text-lg leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <p className="max-w-xl text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('hero.extraDescription')}
              </p>
            </motion.div>

            {/* أزرار الـ CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: animationDuration, delay: 0.4 }}
              className="flex flex-col sm:flex-row flex-wrap gap-5 pt-8"
            >
              {/* زر الشراء الرئيسي */}
              <motion.div
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.92 }}
                className="flex-1 min-w-[200px]"
              >
                <Link
                  href="/buy"
                  className="relative block w-full px-8 py-4 rounded-2xl font-bold text-lg text-white shadow-2xl overflow-hidden group transition-all"
                >
                  {/* الخلفية الرئيسية */}
                  <span className="absolute inset-0 bg-gradient-to-br from-brand via-amber-600 to-orange-600 transition-all duration-300 group-hover:shadow-2xl" />

                  {/* تأثير التوهج */}
                  {!shouldReduceMotion && (
                    <>
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      <motion.span
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/20 to-transparent"
                        transition={{ duration: 0.3 }}
                      />
                    </>
                  )}

                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <span className="text-2xl">🛍️</span>
                    <span>{t('hero.ctaBuy')}</span>
                  </span>
                </Link>
              </motion.div>

              {/* زر المكتبة */}
              <motion.div
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.92 }}
                className="flex-1 min-w-[200px]"
              >
                <Link
                  href="/books"
                  className="relative block w-full px-8 py-4 rounded-2xl font-bold text-lg text-brand dark:text-brand-light shadow-xl overflow-hidden group transition-all border-2 border-brand/40 hover:border-brand/70"
                >
                  {/* الخلفية */}
                  <span className="absolute inset-0 bg-gradient-to-br from-brand/10 via-white/50 to-brand/5 dark:from-slate-700/50 dark:via-slate-800/50 dark:to-slate-900/50" />

                  {/* تأثير على hover */}
                  {!shouldReduceMotion && (
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
                      animate={shouldReduceMotion ? {} : { x: ['-100%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  )}

                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <span className="text-2xl">📚</span>
                    <span>{t('hero.ctaBooks')}</span>
                  </span>
                </Link>
              </motion.div>

              {/* زر الطريق */}
              <motion.div
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.92 }}
                className="flex-1 min-w-[200px]"
              >
                <Link
                  href="/route"
                  className="relative block w-full px-8 py-4 rounded-2xl font-bold text-lg text-brand dark:text-brand-light shadow-xl overflow-hidden group transition-all border-2 border-brand/40 hover:border-brand/70"
                >
                  {/* الخلفية */}
                  <span className="absolute inset-0 bg-gradient-to-br from-brand/10 via-white/50 to-brand/5 dark:from-slate-700/50 dark:via-slate-800/50 dark:to-slate-900/50" />

                  {/* تأثير على hover */}
                  {!shouldReduceMotion && (
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
                      animate={shouldReduceMotion ? {} : { x: ['-100%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  )}

                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <span className="text-2xl">🗺️</span>
                    <span>{t('hero.ctaRoute')}</span>
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* العمود الأيمن: صورة المكتبة مع تأثيرات */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: animationDuration + 0.1, type: 'spring', stiffness: 80 }}
            className="flex-1 flex justify-center items-center"
          >
            <div className="relative group h-96 w-96 md:h-[500px] md:w-[500px] lg:h-[600px] lg:w-[600px]">
              {/* التوهج الخلفي */}
              {!shouldReduceMotion && (
                <motion.div
                  className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-brand/40 via-amber-500/30 to-orange-500/40 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity"
                  animate={{ scale: [0.95, 1.08, 0.95] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              )}

              {/* الصورة */}
              <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white/50 dark:ring-slate-800/50 backdrop-blur">
                <Image
                  src="/images/herolibrary.png"
                  alt={locale === 'ar' ? 'المكتبة المتنقلة' : 'Mobile Library'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-125"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 500px, 600px"
                  priority
                />

                {/* طبقة overlay متحركة */}
                {!shouldReduceMotion && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-brand/0 via-white/0 to-white/20"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* الإحصائيات المتحركة */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: animationDuration, delay: animationDelay + 0.5 }}
          className="mt-16 md:mt-20 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6"
        >
          <AnimatePresence>
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: animationDuration,
                  delay: animationDelay + (idx * 0.1)
                }}
                whileHover={shouldReduceMotion ? {} : { y: -8, scale: 1.05 }}
                className="group relative overflow-hidden"
              >
                {/* البطاقة الخارجية مع الـ gradient */}
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-1 backdrop-blur-sm transition-all`}>
                  {/* الخلفية المتحركة داخل الـ gradient */}
                  {!shouldReduceMotion && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${stat.lightColor}`}
                      animate={{ opacity: [0, 0.1, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {/* محتوى البطاقة */}
                  <div className="relative h-full rounded-2xl bg-white/60 dark:bg-slate-900/60 p-6 md:p-8 text-center backdrop-blur-sm transition-all duration-300 group-hover:bg-white/80 dark:group-hover:bg-slate-800/80">

                    {/* الأيقونة */}
                    <motion.div
                      className="text-3xl md:text-4xl mb-3"
                      animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                    >
                      {stat.icon}
                    </motion.div>

                    {/* الرقم */}
                    <motion.p
                      className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-gradient-to-r bg-clip-text"
                      style={{
                        backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`
                      }}
                      animate={shouldReduceMotion ? {} : { scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.15 }}
                    >
                      <span className={`bg-gradient-to-r ${stat.lightColor} bg-clip-text text-transparent`}>
                        <AnimatedCounter
                          value={stat.value}
                          duration={2 + (idx * 0.3)}
                          delay={idx * 0.1}
                        />
                      </span>
                      {stat.suffix}
                    </motion.p>

                    {/* الوصف */}
                    <motion.p
                      className="mt-3 text-xs md:text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                    >
                      {stat.label}
                    </motion.p>

                    {/* خط ديناميكي أسفل البطاقة */}
                    {!shouldReduceMotion && (
                      <motion.div
                        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.lightColor}`}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.5, delay: 0.3 + idx * 0.1 }}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}