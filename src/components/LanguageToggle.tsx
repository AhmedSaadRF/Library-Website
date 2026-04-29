"use client";

import { useTranslation } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export function LanguageToggle() {
  const { toggleLocale, locale } = useTranslation();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      onClick={toggleLocale}
      className="rounded-full border border-white/20 bg-white/70 px-3 py-2 text-xs font-black tracking-[0.3em] text-brand shadow-glow backdrop-blur dark:bg-slate-900/70 dark:text-brand-light"
      aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {locale === 'ar' ? 'EN' : 'AR'}
    </motion.button>
  );
}
