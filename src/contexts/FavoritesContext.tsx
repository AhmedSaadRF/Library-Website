"use client";

import { createContext, ReactNode, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { readStorage, writeStorage } from '@/utils/localStorageUtils';

interface FavoritesContextValue {
  favorites: string[];
  toggleFavorite: (bookId: string) => void;
  isFavorite: (bookId: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  // Local storage key based on user email
  const storageKey = useMemo(() => 
    user ? `user-favorites-${user.email}` : null
  , [user]);

  // Load favorites when user changes
  useEffect(() => {
    if (storageKey) {
      const saved = readStorage<string[]>(storageKey, []);
      setFavorites(saved);
    } else {
      setFavorites([]);
    }
  }, [storageKey]);

  const toggleFavorite = (bookId: string) => {
    if (!storageKey) return;

    setFavorites((prev) => {
      const isFav = prev.includes(bookId);
      const updated = isFav 
        ? prev.filter((id) => id !== bookId) 
        : [...prev, bookId];
      
      writeStorage(storageKey, updated);
      return updated;
    });
  };

  const isFavorite = (bookId: string) => favorites.includes(bookId);

  const value = useMemo(() => ({
    favorites,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [favorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
}
