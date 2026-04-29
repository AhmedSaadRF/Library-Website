"use client";

import { defaultBooks } from '@/data/defaultBooks';
import { defaultCategories } from '@/data/defaultCategories';
import { Book, Category } from '@/types';
import { readStorage, writeStorage } from '@/utils/localStorageUtils';
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

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(defaultBooks);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  useEffect(() => {
    const storedBooks = readStorage<Book[]>('mobile-library-books', defaultBooks);
    const storedCategories = readStorage<Category[]>('mobile-library-categories', defaultCategories);
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
      addBook: (book) => setBooks((current) => [book, ...current]),
      updateBook: (book) =>
        setBooks((current) => current.map((item) => (item.id === book.id ? book : item))),
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
        const activeBooks = books.filter(
          (book) =>
            category &&
            (book.category_ar === category.name_ar || book.category_en === category.name_en)
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
