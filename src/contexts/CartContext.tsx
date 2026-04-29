"use client";

import { CartItem } from '@/types';
import { readStorage, writeStorage } from '@/utils/localStorageUtils';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setItems(readStorage<CartItem[]>('mobile-library-cart', []));
  }, []);

  useEffect(() => {
    writeStorage('mobile-library-cart', items);
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addToCart: (bookId) => {
        setIsOpen(true);
        setItems((current) => {
          const existing = current.find((item) => item.bookId === bookId);
          if (existing) {
            return current.map((item) =>
              item.bookId === bookId ? { ...item, quantity: item.quantity + 1 } : item
            );
          }

          return [...current, { bookId, quantity: 1 }];
        });
      },
      updateQuantity: (bookId, quantity) => {
        if (quantity <= 0) {
          setItems((current) => current.filter((item) => item.bookId !== bookId));
          return;
        }

        setItems((current) =>
          current.map((item) => (item.bookId === bookId ? { ...item, quantity } : item))
        );
      },
      removeFromCart: (bookId) =>
        setItems((current) => current.filter((item) => item.bookId !== bookId)),
      clearCart: () => setItems([])
    }),
    [isOpen, items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
