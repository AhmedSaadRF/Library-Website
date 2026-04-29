"use client";

import ar from '@/translations/ar.json';
import en from '@/translations/en.json';
import { Direction, Locale, TranslationDictionary } from '@/types';
import { readStorage, writeStorage } from '@/utils/localStorageUtils';
import { stopSpeaking } from '@/utils/speechSynthesisUtils';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

interface LanguageContextValue {
  locale: Locale;
  dir: Direction;
  toggleLocale: () => void;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const dictionaries: Record<Locale, TranslationDictionary> = { ar, en };
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar');

  useEffect(() => {
    const stored = readStorage<Locale>('mobile-library-locale', 'ar');
    setLocaleState(stored);
  }, []);

  useEffect(() => {
    writeStorage('mobile-library-locale', locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    stopSpeaking();
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      dir: locale === 'ar' ? 'rtl' : 'ltr',
      setLocale: (nextLocale) => setLocaleState(nextLocale),
      toggleLocale: () => setLocaleState((current) => (current === 'ar' ? 'en' : 'ar')),
      t: (key) => dictionaries[locale][key] ?? key
    }),
    [locale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
}
