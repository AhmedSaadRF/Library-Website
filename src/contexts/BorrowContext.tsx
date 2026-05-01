"use client";

import { Borrowing } from '@/types';
import { readStorage, writeStorage } from '@/utils/localStorageUtils';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

interface BorrowContextValue {
  borrowCart: string[]; // book IDs
  borrowings: Borrowing[];
  activeBorrowingsCount: number; // NEW
  addToBorrowCart: (bookId: string) => void;
  removeFromBorrowCart: (bookId: string) => void;
  clearBorrowCart: () => void;
  confirmBorrowing: (userEmail: string, items: Array<{ id: string, title_ar: string, title_en: string }>, duration: number) => void;
  returnBook: (borrowingId: string) => void;
  getBorrowPrice: (duration: number) => number;
}

const BorrowContext = createContext<BorrowContextValue | undefined>(undefined);

export function BorrowProvider({ children }: { children: ReactNode }) {
  const [borrowCart, setBorrowCart] = useState<string[]>([]);
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);

  useEffect(() => {
    setBorrowCart(readStorage<string[]>('mobile-library-borrow-cart', []));
    setBorrowings(readStorage<Borrowing[]>('user-borrowings', []));
  }, []);

  useEffect(() => {
    writeStorage('mobile-library-borrow-cart', borrowCart);
  }, [borrowCart]);

  useEffect(() => {
    writeStorage('user-borrowings', borrowings);
  }, [borrowings]);

  const activeBorrowingsCount = useMemo(() => {
    return borrowings.filter(b => b.status === 'active').length;
  }, [borrowings]);

  const value = useMemo<BorrowContextValue>(
    () => ({
      borrowCart,
      borrowings,
      activeBorrowingsCount,
      addToBorrowCart: (id) => setBorrowCart((curr) => [...new Set([...curr, id])]),
      removeFromBorrowCart: (id) => setBorrowCart((curr) => curr.filter((i) => i !== id)),
      clearBorrowCart: () => setBorrowCart([]),
      confirmBorrowing: (userEmail, items, duration) => {
        const now = new Date();
        const dueDate = new Date();
        dueDate.setDate(now.getDate() + duration);

        const newBorrowings: Borrowing[] = items.map((item) => ({
          id: Math.random().toString(36).substr(2, 9),
          bookId: item.id,
          bookTitle_ar: item.title_ar,
          bookTitle_en: item.title_en,
          userEmail,
          borrowDate: now.toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0],
          duration,
          status: 'active'
        }));

        setBorrowings((curr) => [...newBorrowings, ...curr]);
        setBorrowCart([]);
      },
      returnBook: (id) => {
        setBorrowings((curr) =>
          curr.map((b) => (b.id === id ? { ...b, status: 'returned' as const } : b))
        );
      },
      getBorrowPrice: (duration) => {
        if (duration <= 7) return 20;
        if (duration <= 14) return 35;
        return 60; // 30 days
      }
    }),
    [borrowCart, borrowings, activeBorrowingsCount]
  );

  return <BorrowContext.Provider value={value}>{children}</BorrowContext.Provider>;
}

export function useBorrow() {
  const context = useContext(BorrowContext);
  if (!context) throw new Error('useBorrow must be used within BorrowProvider');
  return context;
}