"use client";

import { useBooks } from '@/contexts/BooksContext';
import { useRouteStops } from '@/contexts/RouteContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

function CountUp({ value }: { value: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 2000 });
  const rounded = useTransform(spring, (latest) => Math.round(latest));

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function HomeStats() {
  const { books, categories } = useBooks();
  const { stops } = useRouteStops();
  const { t, locale } = useTranslation();

  const items = [
    { label: locale === 'ar' ? 'كتاب' : 'Books', value: books.length },
    { label: locale === 'ar' ? 'محطة' : 'Stations', value: stops.length },
    { label: locale === 'ar' ? 'تصنيف' : 'Categories', value: categories.length },
    { label: locale === 'ar' ? 'قارئ' : 'Readers', value: 240 }
  ];

  return (
    <motion.section 
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      {items.map((item) => (
        <motion.article
          key={item.label}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="rounded-[2rem] border border-white/20 bg-white/70 p-6 shadow-glow backdrop-blur dark:bg-slate-900/60"
        >
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand/70">{item.label}</p>
          <p className="mt-3 text-5xl font-black text-slate-900 dark:text-white">
            <CountUp value={item.value} />
          </p>
        </motion.article>
      ))}
    </motion.section>
  );
}
