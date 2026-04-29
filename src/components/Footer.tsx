"use client";

import { useTranslation } from '@/contexts/LanguageContext';
import Image from 'next/image';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-brand/10 bg-white/80 py-8 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 text-center sm:px-6 lg:px-8">
        <Image src="/images/logo.png" alt={t('brandName')} width={72} height={72} className="h-16 w-16" />
        <p className="text-lg font-semibold text-brand dark:text-brand-light">{t('brandSlogan')}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">{t('footer.copy')}</p>
      </div>
    </footer>
  );
}
