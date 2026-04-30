"use client";

import dynamic from 'next/dynamic';
import { PageShell } from '@/components/PageShell';
import { useTranslation } from '@/contexts/LanguageContext';
import { useRouteStops } from '@/contexts/RouteContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, ChevronRight, Navigation } from 'lucide-react';

const DynamicMap = dynamic(
  () => import('@/components/MapWithRoute').then((mod) => mod.MapWithRoute),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[600px] items-center justify-center rounded-[2rem] border border-brand/10 bg-white/70 shadow-glow backdrop-blur dark:bg-slate-900/60">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
      </div>
    )
  }
);

export default function RoutePage() {
  const { t, locale, dir } = useTranslation();
  const { stops, selectedStopId, setSelectedStopId } = useRouteStops();

  const sortedStops = [...stops].sort((a, b) => a.order - b.order);

  return (
    <PageShell>
      <section className="space-y-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white md:text-5xl">
            {t('route.title')}
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            {t('route.live')}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
          {/* Sidebar */}
          <aside className="order-2 space-y-4 lg:order-1">
            <div className="flex items-center gap-2 px-2 text-brand font-bold uppercase tracking-wider text-sm">
              <Navigation className="size-4" />
              {t('route.stations')}
            </div>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {sortedStops.map((stop, index) => {
                  const isSelected = selectedStopId === stop.id;
                  const name = locale === 'ar' ? stop.name_ar : stop.name_en;
                  const date = locale === 'ar' ? stop.date_ar : stop.date_en;
                  const time = locale === 'ar' ? stop.time_ar : stop.time_en;

                  return (
                    <motion.button
                      key={stop.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedStopId(stop.id)}
                      className={`group w-full text-left transition-all duration-300 p-4 rounded-[2rem] border ${
                        isSelected
                          ? 'bg-brand text-white border-brand shadow-glow scale-[1.02]'
                          : 'bg-white/70 dark:bg-slate-900/60 border-brand/10 hover:border-brand/30 dark:text-white'
                      } flex flex-col gap-3`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex size-8 shrink-0 items-center justify-center rounded-full font-bold text-sm ${
                          isSelected ? 'bg-white text-brand' : 'bg-brand text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <p className="font-bold truncate text-lg">{name}</p>
                        <ChevronRight className={`ms-auto size-5 transition-transform ${isSelected ? 'rotate-90' : ''} ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                      </div>

                      <div className="space-y-1.5 ml-11">
                        <div className={`flex items-center gap-2 text-sm ${isSelected ? 'text-white/90' : 'text-brand font-semibold'}`}>
                          <Calendar className="size-4" />
                          {date || '---'}
                        </div>
                        <div className={`flex items-center gap-2 text-sm ${isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                          <Clock className="size-4" />
                          {time || '---'}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </aside>

          {/* Map Container */}
          <div className="order-1 h-[400px] lg:h-[600px] overflow-hidden rounded-[2.5rem] border border-brand/10 shadow-glow lg:order-2">
            <DynamicMap />
          </div>
        </div>
      </section>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 90, 43, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </PageShell>
  );
}