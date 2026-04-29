"use client";

import { useBooks } from '@/contexts/BooksContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { Category } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';

const emptyCategory: Category = {
  id: '',
  name_ar: '',
  name_en: ''
};

export function AdminCategoryManager() {
  const { categories, addCategory, updateCategory, deleteCategory } = useBooks();
  const { locale, t } = useTranslation();
  const [form, setForm] = useState<Category>(emptyCategory);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingId) {
      updateCategory({ ...form, id: editingId });
      setEditingId(null);
      setForm(emptyCategory);
      setMessage('');
      return;
    }

    addCategory({ ...form, id: uuid() });
    setForm(emptyCategory);
    setMessage('');
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <AnimatePresence>
          {categories.map((category) => (
            <motion.div
              key={category.id}
              layout
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              className="rounded-[2rem] border border-brand/10 bg-white p-5 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {locale === 'ar' ? category.name_ar : category.name_en}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    {category.name_ar} / {category.name_en}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(category.id);
                      setForm(category);
                    }}
                    className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700"
                  >
                    {t('admin.edit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const result = deleteCategory(category.id);
                      setMessage(result.success ? '' : t('admin.categoryHasBooks'));
                    }}
                    className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700"
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
        onSubmit={onSubmit}
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        className="space-y-4 rounded-[2rem] border border-brand/10 bg-white p-6 shadow-glow dark:bg-slate-900"
      >
        <motion.input
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          value={form.name_ar}
          onChange={(e) => setForm((current) => ({ ...current, name_ar: e.target.value }))}
          placeholder={t('admin.categoryNameAr')}
          className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
        />
        <motion.input
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          value={form.name_en}
          onChange={(e) => setForm((current) => ({ ...current, name_en: e.target.value }))}
          placeholder={t('admin.categoryNameEn')}
          className="w-full rounded-2xl border border-brand/15 bg-transparent px-4 py-3 outline-none ring-brand focus:ring-2"
        />
        {message ? <p className="text-sm text-rose-600">{message}</p> : null}
        <button type="submit" className="w-full rounded-full bg-brand px-4 py-3 font-semibold text-white">
          {editingId ? t('admin.updateCategory') : t('admin.addCategory')}
        </button>
      </motion.form>
    </div>
  );
}
