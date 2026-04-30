"use client";

import { useTranslation } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { currencies, Currency } from '@/utils/currencyConverter';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface CurrencySelectorProps {
  compact?: boolean;
}

export function CurrencySelector({ compact }: CurrencySelectorProps) {
  const { t } = useTranslation();
  const { currency: globalCurrency, setCurrency: setGlobalCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div className={compact ? "" : "space-y-3"}>
        {!compact && (
          <label className="text-sm font-black text-slate-500 dark:text-slate-400 flex items-center gap-2 px-1">
            <Globe className="size-4" />
            {t('currency.label')}
          </label>
        )}
        
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between gap-3 bg-white dark:bg-slate-950 border border-brand/20 rounded-2xl transition-all hover:border-brand/40 shadow-sm ${
            compact ? 'px-4 py-2 text-sm font-black' : 'w-full px-6 py-3.5 text-lg font-black'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-brand">{globalCurrency}</span>
          </span>
          <ChevronDown className={`size-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[100] mt-2 w-full min-w-[140px] bg-white dark:bg-slate-900 border border-brand/10 rounded-3xl shadow-2xl overflow-hidden p-2 backdrop-blur-xl"
          >
            {currencies.map((currency) => (
              <button
                key={currency}
                type="button"
                onClick={() => {
                  setGlobalCurrency(currency);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-left transition-all ${
                  globalCurrency === currency
                    ? 'bg-brand text-white shadow-glow'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-brand/5 dark:hover:bg-white/5 font-bold'
                }`}
              >
                <span className="font-black">{currency}</span>
                {globalCurrency === currency && <Check className="size-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
