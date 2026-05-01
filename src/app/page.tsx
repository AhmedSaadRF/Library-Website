"use client";

import { AnimatedBookCard } from '@/components/AnimatedBookCard';
import { BookActions } from '@/components/BookActions';
import { HomeHero } from '@/components/HomeHero';
import { HomeStats } from '@/components/HomeStats';
import { PageShell } from '@/components/PageShell';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/AnimatedComponents';
import { useBooks } from '@/contexts/BooksContext';
import { useRouteStops } from '@/contexts/RouteContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HomePage() {
  const { t, locale } = useTranslation();
  const { books } = useBooks();
  const { stops } = useRouteStops();
  const latestBooks = books.slice(0, 3);
  const topStops = [...stops].sort((a, b) => a.order - b.order).slice(0, 3);

  return (
    <PageShell>
      <div className="space-y-16">
        <HomeHero />
        {/* <HomeStats /> */}

        <Reveal>
          <section className="grid gap-12 lg:grid-cols-[1fr_0.95fr] items-center">
            <div className="space-y-6 rounded-[2.5rem] border border-white/20 bg-white/65 p-10 shadow-glow backdrop-blur dark:bg-slate-950/50">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand/70">
                {t('home.features')}
              </p>
              <h2 className="text-5xl font-black text-transparent gradient-text leading-tight">{t('home.aboutTitle')}</h2>
              <div className="space-y-6 text-lg leading-8 text-slate-700 dark:text-slate-200 font-medium">
                <p>{t('home.aboutBody1')}</p>
                <p>{t('home.aboutBody2')}</p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <Reveal delay={0.1}>
                  <div className="p-6 bg-brand/5 dark:bg-white/5 rounded-[2rem] border border-brand/10">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{t('about.mission')}</h3>
                    <p className="text-sm text-slate-500 font-bold leading-relaxed">{t('about.missionText')}</p>
                  </div>
                </Reveal>
                <Reveal delay={0.2}>
                  <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/5">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{t('about.vision')}</h3>
                    <p className="text-sm text-slate-500 font-bold leading-relaxed">{t('about.visionText')}</p>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.3}>
                <div className="p-8 bg-brand text-white rounded-[2.5rem] shadow-glow">
                  <h3 className="text-2xl font-black mb-2">{t('about.impact')}</h3>
                  <p className="font-bold opacity-90 leading-relaxed">{t('about.impactText')}</p>
                </div>
              </Reveal>
            </div>

            <StaggerContainer className="grid gap-4 sm:grid-cols-2">
              {[
                '/images/herolibrary.png',
                '/images/train-hero.png',
                '/images/books-world.png',
                '/images/categories.png'
              ].map((src, index) => (
                <StaggerItem
                  key={src}
                  className={`${index === 0 ? 'sm:col-span-2' : ''}`}
                >
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="overflow-hidden rounded-[2rem] border border-white/20 bg-white/60 p-3 shadow-glow backdrop-blur dark:bg-slate-950/50"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.4rem]">
                      <Image 
                        src={src} 
                        alt="" 
                        fill 
                        className="object-cover" 
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </Reveal>

        <section className="space-y-6">
          <Reveal>
            <div>
              <h2 className="text-4xl font-black text-transparent gradient-text">{t('home.latestBooks')}</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {t('home.latestBooksSubtitle')}
              </p>
            </div>
          </Reveal>
          <StaggerContainer className="grid gap-6 lg:grid-cols-3">
            {latestBooks.map((book) => (
              <StaggerItem key={book.id}>
                <AnimatedBookCard book={book} extra={<BookActions bookId={book.id} />} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        <section className="space-y-6">
          <Reveal>
            <div>
              <h2 className="text-4xl font-black text-transparent gradient-text">{t('home.topStops')}</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {t('home.topStopsSubtitle')}
              </p>
            </div>
          </Reveal>
          <StaggerContainer className="grid gap-5 md:grid-cols-3">
            {topStops.map((stop, index) => (
              <StaggerItem key={stop.id}>
                <motion.article
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="rounded-[2rem] border border-white/20 bg-white/65 p-6 shadow-glow backdrop-blur dark:bg-slate-950/50"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand/70">
                    0{stop.order}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                    {locale === 'ar' ? stop.name_ar : stop.name_en}
                  </h3>
                  <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
                    {locale === 'ar' ? stop.description_ar : stop.description_en}
                  </p>
                </motion.article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </div>
    </PageShell>
  );
}
