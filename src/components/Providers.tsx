"use client";

import { AdminProvider } from '@/contexts/AdminContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { BooksProvider } from '@/contexts/BooksContext';
import { CartProvider } from '@/contexts/CartContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { RouteProvider } from '@/contexts/RouteContext';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        <AuthProvider>          {/* ✅ AuthProvider أولاً */}
          <AdminProvider>       {/* ✅ ثم AdminProvider الذي يعتمد عليه */}
            <BooksProvider>
              <RouteProvider>
                <CartProvider>{children}</CartProvider>
              </RouteProvider>
            </BooksProvider>
          </AdminProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}