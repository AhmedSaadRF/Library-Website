"use client";

import { defaultBooks } from '@/data/defaultBooks';
import { defaultCategories } from '@/data/defaultCategories';
import { Book, Category } from '@/types';
import { readStorage, writeStorage } from '@/utils/localStorageUtils';
import { matchesCategory } from '@/utils/categoryUtils';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

interface BooksContextValue {
  books: Book[];
  categories: Category[];
  addBook: (book: Book) => void;
  updateBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  moveBook: (id: string, direction: 'up' | 'down') => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => { success: boolean; message?: string };
}

const BooksContext = createContext<BooksContextValue | undefined>(undefined);

// دالة لتحويل التصنيفات المخزنة (قد تكون نصوصاً قديمة) إلى مصفوفة
function normalizeCategories(cat: string | string[]): string[] {
  if (Array.isArray(cat)) {
    // إزالة العناصر الفارغة وتقليم المسافات
    return cat.filter(c => c && c.trim().length > 0);
  }
  if (typeof cat === 'string' && cat.trim().length > 0) {
    // إذا كان النص يحتوي على فاصل " • "، نقسمه
    if (cat.includes(' • ')) {
      return cat.split(' • ').map(c => c.trim()).filter(Boolean);
    }
    // وإلا نعتبره تصنيفاً واحداً
    return [cat.trim()];
  }
  return [];
}

// دالة لتطهير كتاب قديم (تحويل التصنيفات من نص إلى مصفوفة)
function sanitizeBook(book: Book): Book {
  return {
    ...book,
    category_ar: normalizeCategories(book.category_ar),
    category_en: normalizeCategories(book.category_en),
  };
}

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(defaultBooks.map(sanitizeBook));
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  useEffect(() => {
    const DATA_VERSION = 'v3_arrays_only'; // زيادة الإصدار لإجبار إعادة التعيين
    const storedVersion = localStorage.getItem('mobile-library-data-version');
    
    let storedBooks = readStorage<Book[]>('mobile-library-books', defaultBooks);
    let storedCategories = readStorage<Category[]>('mobile-library-categories', defaultCategories);

    if (storedVersion !== DATA_VERSION) {
      // إعادة تعيين كاملة من البيانات الافتراضية الجديدة
      storedBooks = defaultBooks.map(sanitizeBook);
      storedCategories = defaultCategories;
      localStorage.setItem('mobile-library-data-version', DATA_VERSION);
    } else {
      // تنظيف البيانات المخزنة القديمة (تحويل التصنيفات إلى مصفوفات)
      storedBooks = storedBooks.map(sanitizeBook);
      storedCategories = storedCategories;
    }

    setBooks(storedBooks);
    setCategories(storedCategories);
    writeStorage('mobile-library-books', storedBooks);
    writeStorage('mobile-library-categories', storedCategories);
  }, []);

  useEffect(() => {
    writeStorage('mobile-library-books', books);
  }, [books]);

  useEffect(() => {
    writeStorage('mobile-library-categories', categories);
  }, [categories]);

  const value = useMemo<BooksContextValue>(
    () => ({
      books,
      categories,
      addBook: (book) => setBooks((current) => [sanitizeBook(book), ...current]),
      updateBook: (book) =>
        setBooks((current) => current.map((item) => (item.id === book.id ? sanitizeBook(book) : item))),
      deleteBook: (id) => setBooks((current) => current.filter((item) => item.id !== id)),
      moveBook: (id, direction) => {
        setBooks((current) => {
          const list = [...current];
          const index = list.findIndex((item) => item.id === id);
          const swapIndex = direction === 'up' ? index - 1 : index + 1;
          if (index < 0 || swapIndex < 0 || swapIndex >= list.length) return current;
          [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
          return list;
        });
      },
      addCategory: (category) => setCategories((current) => [...current, category]),
      updateCategory: (category) =>
        setCategories((current) => current.map((item) => (item.id === category.id ? category : item))),
      deleteCategory: (id) => {
        const category = categories.find((item) => item.id === id);
        if (!category) return { success: false, message: 'Category not found' };

        const activeBooks = books.filter(
          (book) =>
            matchesCategory(book.category_ar, category.name_ar) ||
            matchesCategory(book.category_en, category.name_en)
        );

        if (activeBooks.length > 0) {
          return { success: false, message: 'Category still has books' };
        }

        setCategories((current) => current.filter((item) => item.id !== id));
        return { success: true };
      }
    }),
    [books, categories]
  );

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}

export function useBooks() {
  const context = useContext(BooksContext);
  if (!context) throw new Error('useBooks must be used within BooksProvider');
  return context;
}