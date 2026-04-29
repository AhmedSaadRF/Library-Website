"use client";

import { AnimatedBookCard } from '@/components/AnimatedBookCard';
import { HomeHero } from '@/components/HomeHero';
import { HomeStats } from '@/components/HomeStats';
import { PageShell } from '@/components/PageShell';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useBooks } from '@/contexts/BooksContext';
import { useRouteStops } from '@/contexts/RouteContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HomePage() {
  const { t } = useTranslation();
  const { books } = useBooks();
  const { stops } = useRouteStops();
  const latestBooks = books.slice(0, 3);
  const topStops = [...stops].sort((a, b) => a.order - b.order).slice(0, 3);

  return (
    <PageShell>
      <div className="space-y-16">
        <HomeHero />
        <HomeStats />

        <ScrollReveal>
          <section className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
            <div className="space-y-4 rounded-[2.5rem] border border-white/20 bg-white/65 p-8 shadow-glow backdrop-blur dark:bg-slate-950/50">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand/70">
                {t('home.features')}
              </p>
              <h2 className="text-4xl font-black text-transparent gradient-text">{t('home.aboutTitle')}</h2>
              <p className="leading-8 text-slate-700 dark:text-slate-200">
                {t('home.aboutBody1')}
              </p>
              <p className="leading-8 text-slate-700 dark:text-slate-200">
                {t('home.aboutBody2')}
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {['/images/map-hero.png', '/images/train-hero.png', '/images/books-world.png', '/images/categories.png'].map(
                (src, index) => (
                  <motion.div
                    key={src}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`overflow-hidden rounded-[2rem] border border-white/20 bg-white/60 p-3 shadow-glow backdrop-blur dark:bg-slate-950/50 ${index === 0 ? 'sm:col-span-2' : ''}`}
                  >
                    <Image src={src} alt={t('brandSlogan')} width={1200} height={900} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="h-full w-full rounded-[1.4rem] object-cover" />
                  </motion.div>
                )
              )}
            </motion.div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="space-y-6">
            <div>
              <h2 className="text-4xl font-black text-transparent gradient-text">{t('home.latestBooks')}</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {t('home.latestBooksSubtitle')}
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {latestBooks.map((book) => (
                <AnimatedBookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="space-y-6">
            <div>
              <h2 className="text-4xl font-black text-transparent gradient-text">{t('home.topStops')}</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {t('home.topStopsSubtitle')}
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {topStops.map((stop, index) => (
                <motion.article
                  key={stop.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="rounded-[2rem] border border-white/20 bg-white/65 p-6 shadow-glow backdrop-blur dark:bg-slate-950/50"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand/70">
                    0{stop.order}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                    {stop.name_ar}
                  </h3>
                  <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
                    {stop.description_ar}
                  </p>
                </motion.article>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </PageShell>
  );
}
