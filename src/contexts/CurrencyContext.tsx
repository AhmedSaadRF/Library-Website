"use client";

import { createContext, ReactNode, useContext, useEffect, useState, useMemo } from 'react';
import { Currency, fetchRates, convertPrice } from '@/utils/currencyConverter';

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: Record<string, number>;
  formatPrice: (egpAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('EGP');
  const [rates, setRates] = useState<Record<string, number>>({ EGP: 1, USD: 0.021, EUR: 0.019, GBP: 0.016 });

  useEffect(() => {
    // Load preference
    const saved = localStorage.getItem('preferred-currency') as Currency;
    if (saved) setCurrencyState(saved);

    // Fetch rates
    fetchRates().then(setRates);
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('preferred-currency', c);
  };

  const formatPrice = (egpAmount: number) => {
    const converted = convertPrice(egpAmount, rates[currency] || 1);
    return `${converted.toFixed(2)} ${currency}`;
  };

  const value = useMemo(() => ({
    currency,
    setCurrency,
    rates,
    formatPrice
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [currency, rates]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}
