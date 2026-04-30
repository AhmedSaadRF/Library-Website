"use client";

import { useTranslation } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-brand/10 bg-white/80 py-8 dark:bg-slate-950/90">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 text-center sm:px-6 lg:px-8"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Image src="/images/logo.png" alt={t('brandName')} width={72} height={72} className="h-16 w-16" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg font-semibold text-brand dark:text-brand-light"
        >
          {t('brandSlogan')}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-slate-600 dark:text-slate-300"
        >
          {t('footer.copy')}
        </motion.p>
      </motion.div>
    </footer>
  );
}
