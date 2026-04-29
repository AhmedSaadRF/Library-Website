"use client";

import { useBooks } from '@/contexts/BooksContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { Book } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';

const emptyForm: Book = {
  id: '',
  title_ar: '',
  title_en: '',
  author_ar: '',
  author_en: '',
  category_ar: '',
  category_en: '',
  type: 'regular',
  price: 0,
  coverUrl: '',
  content_ar: '',
  content_en: '',
  audioSrc: ''
};

export function AdminBookManager() {
  const { books, categories, addBook, updateBook, deleteBook, moveBook } = useBooks();
  const { locale, t } = useTranslation();
  const [form, setForm] = useState<Book>({
    ...emptyForm,
    category_ar: categories[0]?.name_ar ?? '',
    category_en: categories[0]?.name_en ?? ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const textFields: Array<{ key: keyof Book; label: string }> = [
    { key: 'title_ar', label: 'Arabic Title' },
    { key: 'title_en', label: 'English Title' },
    { key: 'author_ar', label: 'Arabic Author' },
    { key: 'author_en', label: 'English Author' },
    { key: 'coverUrl', label: t('admin.cover') }
  ];

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingId) {
      updateBook({ ...form, id: editingId });
      setEditingId(null);
      setForm({
        ...emptyForm,
        category_ar: categories[0]?.name_ar ?? '',
        category_en: categories[0]?.name_en ?? ''
      });
      return;
    }

    addBook({ ...form, id: uuid() });
    setForm({
      ...emptyForm,
      category_ar: categories[0]?.name_ar ?? '',
      category_en: categories[0]?.name_en ?? ''
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <AnimatePresence>
          {books.map((book) => (
            <motion.div
              key={book.id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="rounded-[2rem] border border-brand/10 bg-white p-5 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {locale === 'ar' ? book.title_ar : book.title_en}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    {locale === 'ar' ? book.author_ar : book.author_en}
                  </p>
                  <p className="mt-1 text-xs text-brand/80">
                    {locale === 'ar' ? book.category_ar : book.category_en} | {book.type}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => moveBook(book.id, 'up')}
                    className="rounded-full bg-brand/10 px-3 py-2 text-sm font-semibold text-brand"
                  >
                    {t('admin.moveUp')}
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBook(book.id, 'down')}
                    className="rounded-full bg-brand/10 px-3 py-2 text-sm font-semibold text-brand"
                  >
                    {t('admin.moveDown')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(book.id);
                      setForm(book);
                    }}
                    className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700"
                  >
                    {t('admin.edit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteBook(book.id)}
                    className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700"
                    aria-label={t('a11y.deleteBook')}
                  >
                    {t('admin.delete')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.form
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        onSubmit={onSubmit}
        className="space-y-4 rounded-[2rem] border border-brand/10 bg-white p-6 shadow-glow dark:bg-slate-900"
      >
        <div className="grid grid-cols-2 gap-4">
          {textFields.slice(0, 4).map(({ key, label }) => (
            <input
              key={key}
              value={String(form[key] ?? '')}
              onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.value }))}
              placeholder={label}
              className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
            />
          ))}
        </div>
        
        <input
          value={form.coverUrl}
          onChange={(e) => setForm((current) => ({ ...current, coverUrl: e.target.value }))}
          placeholder="Cover Image URL"
          className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
        />

        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm((current) => ({ ...current, price: Number(e.target.value) }))}
            placeholder="Price"
            className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
          />
          <select
            value={`${form.category_ar}|||${form.category_en}`}
            onChange={(e) => {
              const [category_ar, category_en] = e.target.value.split('|||');
              setForm((current) => ({ ...current, category_ar, category_en }));
            }}
            className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
          >
            {categories.map((category) => (
              <option key={category.id} value={`${category.name_ar}|||${category.name_en}`}>
                {locale === 'ar' ? category.name_ar : category.name_en}
              </option>
            ))}
          </select>
          <select
            value={form.type}
            onChange={(e) => setForm((current) => ({ ...current, type: e.target.value as Book['type'] }))}
            className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
          >
            <option value="regular">{t('admin.regular')}</option>
            <option value="audio">{t('admin.audioType')}</option>
          </select>
        </div>

        {form.type === 'audio' && (
          <input
            value={form.audioSrc}
            onChange={(e) => setForm((current) => ({ ...current, audioSrc: e.target.value }))}
            placeholder="Audio Source URL (MP3)"
            className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
          />
        )}

        <textarea
          value={form.content_ar}
          onChange={(e) => setForm((current) => ({ ...current, content_ar: e.target.value }))}
          placeholder="Arabic Content / Description"
          className="min-h-24 w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
        />
        <textarea
          value={form.content_en}
          onChange={(e) => setForm((current) => ({ ...current, content_en: e.target.value }))}
          placeholder="English Content / Description"
          className="min-h-24 w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
        />

        <button type="submit" className="w-full rounded-full bg-brand px-4 py-3 font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]">
          {editingId ? t('admin.updateBook') : t('admin.addBook')}
        </button>
      </motion.form>
    </div>
  );
}
