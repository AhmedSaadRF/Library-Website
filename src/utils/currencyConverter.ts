export type Currency = 'EGP' | 'USD' | 'EUR';
export const currencies: Currency[] = ['EGP', 'USD', 'EUR'];

const FALLBACK_RATES: Record<string, number> = {
  USD: 0.021, // 1 USD ≈ 48 EGP
  EUR: 0.019, // 1 EUR ≈ 52 EGP
};

const CACHE_KEY = 'mobile-library-currency-cache';
const CACHE_DURATION = 3600000; // 1 hour

// Track if we've already warned this session to prevent console flood
let hasWarnedThisSession = false;

export async function fetchRates(): Promise<Record<string, number>> {
  // 1. Try to read from cache first
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { rates, timestamp } = JSON.parse(cached);
        // If cache is less than 1 hour old, use it immediately
        if (Date.now() - timestamp < CACHE_DURATION) {
          return rates;
        }
      } catch (e) {
        // Silent error for cache parsing
      }
    }
  }

  // 2. Try to fetch from reliable API (Frankfurter)
  // Using a timeout to prevent long hanging requests
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=EGP&to=USD,EUR', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const data = await res.json();
    const rates = { EGP: 1, ...data.rates };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ rates, timestamp: Date.now() }));
    }
    return rates;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // 3. Fallback logic
    if (!hasWarnedThisSession) {
      console.warn('Currency API unavailable, using fallback or stale cache. This is normal in some dev environments.');
      hasWarnedThisSession = true;
    }
    
    // Try to return stale cache if available
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          return JSON.parse(cached).rates;
        } catch (e) {}
      }
    }
    
    // Final fallback to hardcoded rates
    return { EGP: 1, ...FALLBACK_RATES };
  }
}

export function convertPrice(amount: number, rate: number): number {
  const raw = amount * rate;
  // Round to nearest 0.25 for a cleaner look in foreign currencies
  return Math.ceil(raw * 4) / 4;
}
