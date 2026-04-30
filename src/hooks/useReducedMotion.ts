"use client";

import { useEffect, useState } from 'react';

/**
 * Hook to detect if the user has requested reduced motion.
 * Returns true if the user prefers reduced motion, false otherwise.
 */
export function useReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check if window and matchMedia are available (client-side only)
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      // Set initial value
      setShouldReduceMotion(mediaQuery.matches);

      // Listen for changes
      const handleChange = (event: MediaQueryListEvent) => {
        setShouldReduceMotion(event.matches);
      };

      // Add listener (using newer addEventListener if available)
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, []);

  return shouldReduceMotion;
}
