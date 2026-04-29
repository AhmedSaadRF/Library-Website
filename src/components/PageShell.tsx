"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <motion.main
      id="page-main"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
    >
      {children}
    </motion.main>
  );
}
