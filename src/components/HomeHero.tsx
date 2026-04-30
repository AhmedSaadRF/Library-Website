"use client";

import { useTranslation } from '@/contexts/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

export function HomeHero() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section ref={ref} className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/50 px-6 py-10 shadow-glow backdrop-blur dark:bg-slate-950/40 md:px-10 lg:px-12 lg:py-14">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-sm font-semibold text-brand dark:text-brand-light"
          >
            {t('brandSlogan')}
          </motion.p>
          <motion.h1
            className="max-w-3xl text-5xl font-black leading-[1.1] text-transparent md:text-6xl lg:text-7xl gradient-text"
          >
            {t('hero.title').split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-200"
          >
            {t('hero.subtitle')}
          </motion.p>
          <div className="flex flex-wrap gap-3">
            {[['/books', t('hero.ctaBooks')], ['/buy', t('hero.ctaBuy')], ['/route', t('hero.ctaRoute')]].map(
              ([href, label], index) => (
                <motion.div key={href} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + index * 0.06 }}>
                  <Link href={href} className={`inline-flex rounded-full px-6 py-3 text-sm font-semibold ${index === 0 ? 'bg-brand text-white' : 'border border-brand/20 bg-white/60 text-brand dark:bg-slate-900/40 dark:text-brand-light'}`}>
                    {label}
                  </Link>
                </motion.div>
              )
            )}
          </div>
        </div>

        <motion.div style={{ y, scale }} className="relative min-h-[420px] overflow-hidden rounded-[2rem]">
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-brand/30 via-transparent to-brand-light/30" />
          <Image
            src="/images/herolibrary.png"
            alt={t('brandSlogan')}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="rounded-[2rem] object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
