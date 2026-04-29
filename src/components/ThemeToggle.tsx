"use client";

import { useTranslation } from '@/contexts/LanguageContext';
import { MoonStar, SunMedium } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.04 }}
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="rounded-full border border-white/20 bg-white/70 p-3 text-brand shadow-glow backdrop-blur dark:border-white/10 dark:bg-slate-900/70 dark:text-brand-light"
      aria-label={isDark ? t('theme.light') : t('theme.dark')}
    >
      {isDark ? <SunMedium className="size-5" /> : <MoonStar className="size-5" />}
    </motion.button>
  );
}
